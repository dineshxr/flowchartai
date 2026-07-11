'use client';

/**
 * Layered, off-screen frame capture for GIF/MP4 exports.
 *
 * The old pipeline re-serialized the ENTIRE canvas DOM with modern-screenshot
 * for every frame (51–82 full captures) while pausing + scrubbing the LIVE
 * on-screen SVG — the visible diagram froze for the whole export and each
 * frame cost hundreds of ms of main-thread work.
 *
 * This module fixes both:
 *  - All work happens on an off-screen CLONE of the export container, so the
 *    visible diagram keeps animating untouched.
 *  - Only the SMIL-animated edges <svg> changes between frames. The static
 *    HTML (background, tiles, labels, icons) is captured ONCE per export; each
 *    frame then costs one tiny SVG serialization + image decode + three
 *    drawImage calls instead of a full DOM capture.
 *
 * It also reads the real loop period from the SMIL attributes so exports loop
 * seamlessly instead of cutting at an arbitrary hardcoded duration.
 */
import { domToCanvas } from 'modern-screenshot';

const SVG_NS = 'http://www.w3.org/2000/svg';

// ─── SMIL timing ──────────────────────────────────────────────────────────────

/** Parse a SMIL clock value ("2.6s", "300ms", "0.35s", "1.5") to seconds. */
export function parseClock(v: string | null): number {
  if (!v) return 0;
  const s = v.trim();
  if (s.endsWith('ms')) return Number.parseFloat(s) / 1000;
  if (s.endsWith('s')) return Number.parseFloat(s);
  const n = Number.parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}

export interface SmilTiming {
  /** Loop period in seconds — after `leadIn`, the animation repeats every `period`. */
  period: number;
  /**
   * Time at which every staggered animation has begun. Capturing the window
   * [leadIn, leadIn + period) yields a seamless loop.
   */
  leadIn: number;
  /** Whether the container has a deterministically seekable SMIL animation. */
  seekable: boolean;
}

/**
 * Derive loop timing from the SMIL animation attributes. All edge animations
 * in a given mode share one `dur` (begins only phase-shift them), so the loop
 * period is the max `dur`; the max `begin` is the lead-in before the pattern
 * is fully established.
 */
export function analyzeSmilTiming(container: HTMLElement): SmilTiming {
  const svg = container.querySelector('svg');
  const none: SmilTiming = { period: 0, leadIn: 0, seekable: false };
  if (!svg) return none;
  const anims = svg.querySelectorAll(
    'animate, animateMotion, animateTransform'
  );
  if (anims.length === 0) return none;
  const canSeek =
    typeof (svg as SVGSVGElement).pauseAnimations === 'function' &&
    typeof (svg as SVGSVGElement).setCurrentTime === 'function' &&
    typeof (svg as SVGSVGElement).unpauseAnimations === 'function';
  if (!canSeek) return none;
  let period = 0;
  let leadIn = 0;
  for (const a of anims) {
    period = Math.max(period, parseClock(a.getAttribute('dur')));
    leadIn = Math.max(leadIn, parseClock(a.getAttribute('begin')));
  }
  if (!(period > 0)) return none;
  return { period, leadIn, seekable: true };
}

// ─── SMIL frame baking (moved from use-export) ────────────────────────────────

// CSS/geometry presentation values driven by SMIL <animate> that we bake onto
// the target element so a serialized clone reflects the paused frame.
const SMIL_BAKE_PROPS = [
  'opacity',
  'fill-opacity',
  'stroke-opacity',
  'stroke-dashoffset',
  'stroke-dasharray',
  'r',
  'cx',
  'cy',
  'x',
  'y',
  'width',
  'height',
];

/** Resolve the path data an <animateMotion> follows (its `path` attr or <mpath>). */
function motionPathData(motion: Element, svg: SVGSVGElement): string | null {
  const direct = motion.getAttribute('path');
  if (direct) return direct;
  const mpath = motion.querySelector('mpath');
  const href =
    mpath?.getAttribute('href') || mpath?.getAttribute('xlink:href') || '';
  if (href.startsWith('#')) {
    const ref = svg.querySelector(href);
    return ref?.getAttribute('d') ?? null;
  }
  return null;
}

// Motion-path geometry is constant across frames (only the time changes), so
// cache the measuring <path> + its length per `d` string. getTotalLength()/
// getPointAtLength() work on a detached path in Blink, so the cached paths
// never touch the DOM.
const motionGeoCache = new Map<string, { path: SVGPathElement; len: number }>();
function motionGeometry(
  d: string
): { path: SVGPathElement; len: number } | null {
  const cached = motionGeoCache.get(d);
  if (cached) return cached;
  try {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    const len = path.getTotalLength();
    if (!(len > 0)) return null;
    const geo = { path, len };
    motionGeoCache.set(d, geo);
    return geo;
  } catch {
    return null;
  }
}

/**
 * Bake the CURRENT SMIL presentation state of an SVG (after pauseAnimations +
 * setCurrentTime) directly onto the animated elements, so a serialized clone
 * renders the exact paused frame. Crucially this includes the consolidated
 * transform produced by <animateMotion>/<animateTransform> (the traveling
 * dots/arrows) — which getComputedStyle alone does NOT expose. Returns a
 * function that restores the original DOM.
 */
export function bakeSmilFrame(svg: SVGSVGElement): () => void {
  const restores: Array<() => void> = [];
  const now =
    typeof svg.getCurrentTime === 'function' ? svg.getCurrentTime() : 0;
  const targets = new Set<Element>();
  for (const a of svg.querySelectorAll(
    'animate, animateMotion, animateTransform'
  )) {
    if (a.parentElement) targets.add(a.parentElement);
  }

  for (const el of targets) {
    const motion = el.querySelector(':scope > animateMotion');
    if (motion) {
      // <animateMotion> — Chrome does NOT surface motion-path movement
      // through transform.animVal.consolidate(), so compute the point on the
      // path at the current SMIL time and bake a translate (+rotate).
      const d = motionPathData(motion, svg);
      const dur = parseClock(motion.getAttribute('dur'));
      const begin = parseClock(motion.getAttribute('begin'));
      const geo = d ? motionGeometry(d) : null;
      // Before `begin`, SMIL applies no motion transform (fill="remove") —
      // leave the element at its base position to match the live preview.
      if (geo && dur > 0 && now >= begin) {
        try {
          const { path, len } = geo;
          const frac = ((now - begin) % dur) / dur;
          const at = frac * len;
          const p = path.getPointAtLength(at);
          let transform = `translate(${p.x},${p.y})`;
          if (motion.getAttribute('rotate') === 'auto') {
            const ahead = path.getPointAtLength(Math.min(len, at + 1));
            const angle =
              (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI;
            transform += ` rotate(${angle})`;
          }
          const prev = el.getAttribute('transform');
          el.setAttribute('transform', transform);
          restores.push(() =>
            prev === null
              ? el.removeAttribute('transform')
              : el.setAttribute('transform', prev)
          );
        } catch {
          // path math failed — skip motion baking for this element
        }
      }
    } else {
      // Bake <animateTransform> (orbit satellites): multiply the animVal items
      // manually — animVal is a READ-ONLY list, so consolidate() (a mutating
      // API) throws NoModificationAllowedError on it. The item matrices are
      // still readable and already reflect the SMIL time set above.
      try {
        const list = (el as SVGGraphicsElement).transform?.animVal;
        if (list && list.numberOfItems > 0) {
          let m = list.getItem(0).matrix;
          for (let i = 1; i < list.numberOfItems; i++) {
            m = m.multiply(list.getItem(i).matrix);
          }
          const prev = el.getAttribute('transform');
          el.setAttribute(
            'transform',
            `matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`
          );
          restores.push(() =>
            prev === null
              ? el.removeAttribute('transform')
              : el.setAttribute('transform', prev)
          );
        }
      } catch {
        // element has no transform interface — skip
      }
    }

    // Animated geometry / opacity / dash presentation values (covers beams'
    // dash-offset and pulses' r/opacity, which DO surface via computed style).
    const cs = getComputedStyle(el);
    const style = (el as HTMLElement).style;
    for (const prop of SMIL_BAKE_PROPS) {
      const val = cs.getPropertyValue(prop);
      if (val && val !== '' && val !== 'none') {
        const prev = style.getPropertyValue(prop);
        style.setProperty(prop, val);
        restores.push(() =>
          prev ? style.setProperty(prop, prev) : style.removeProperty(prop)
        );
      }
    }
  }

  return () => {
    for (const r of restores) r();
  };
}

// ─── layered frame source ─────────────────────────────────────────────────────

export interface FrameSource {
  /** Composite pixel size (container size × scale). */
  width: number;
  height: number;
  /**
   * Draw the full composite (background → animated SVG at time `t` → tiles)
   * into `ctx` at (0,0)–(width,height).
   */
  drawFrameAt(t: number, ctx: CanvasRenderingContext2D): Promise<void>;
  /** Remove the off-screen clone. Always call in a finally. */
  dispose(): void;
}

const raf = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Build a frame source from the export container. The container is cloned
 * into an off-viewport wrapper (the live diagram is never paused or mutated);
 * static layers are captured once; each frame re-rasterizes only the animated
 * SVG.
 */
export async function createSmilFrameSource(
  container: HTMLElement,
  targetScale: number
): Promise<FrameSource> {
  const rect = container.getBoundingClientRect();
  const scale = Math.max(1, Math.min(4, targetScale));
  const width = Math.max(2, Math.round(rect.width * scale));
  const height = Math.max(2, Math.round(rect.height * scale));

  // Off-viewport (NOT display:none — SMIL seeking and getComputedStyle need
  // layout) wrapper hosting a deep clone of the container.
  const wrapper = document.createElement('div');
  // The editor scopes its theme variables (--border, --foreground, Geist font)
  // to `.infogiph-home`. The wrapper is appended to <body>, outside that
  // scope, so carry the class over — otherwise tiles capture with the wrong
  // palette/typography. Harmless where the class doesn't exist.
  wrapper.className = 'infogiph-home';
  wrapper.style.cssText = `position:fixed;left:-100000px;top:0;width:${rect.width}px;height:${rect.height}px;pointer-events:none;contain:strict;background:transparent;`;
  wrapper.setAttribute('aria-hidden', 'true');
  const clone = container.cloneNode(true) as HTMLElement;
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  const dispose = () => wrapper.remove();

  try {
    // The editor's selection ring is UI state, not content — strip it.
    for (const el of clone.querySelectorAll<HTMLElement>('[style]')) {
      if (el.style.outline) {
        el.style.outline = 'none';
        el.style.outlineOffset = '';
      }
    }

    const svg = clone.querySelector('svg') as SVGSVGElement | null;
    if (!svg) throw new Error('No animated SVG found in export container');
    svg.pauseAnimations();

    // Make sure label fonts are ready before the one-time static capture.
    try {
      await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
    } catch {
      // font API unavailable — capture anyway
    }

    const previewRoot = svg.parentElement as HTMLElement;
    const cloneRect = clone.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const svgX = (svgRect.left - cloneRect.left) * scale;
    const svgY = (svgRect.top - cloneRect.top) * scale;
    const svgW = Math.max(1, svgRect.width * scale);
    const svgH = Math.max(1, svgRect.height * scale);

    // ── static layer 1: background only (preview bg color/gradient on white) ──
    const hidden: Array<{ el: HTMLElement; prev: string }> = [];
    const hide = (el: HTMLElement) => {
      hidden.push({ el, prev: el.style.visibility });
      el.style.visibility = 'hidden';
    };
    hide(svg as unknown as HTMLElement);
    for (const child of Array.from(previewRoot.children)) {
      if (child !== (svg as unknown as Element)) hide(child as HTMLElement);
    }
    const bgLayer = await domToCanvas(clone, {
      scale,
      backgroundColor: '#ffffff',
    });
    // ── static layer 2: HTML tiles/labels with transparent background ─────────
    for (const h of hidden) h.el.style.visibility = h.prev;
    hidden.length = 0;
    hide(svg as unknown as HTMLElement);
    const prevBg = previewRoot.style.background;
    previewRoot.style.background = 'transparent';
    const tilesLayer = await domToCanvas(clone, { scale });
    previewRoot.style.background = prevBg;
    for (const h of hidden) h.el.style.visibility = h.prev;

    const serializer = new XMLSerializer();

    const drawFrameAt = async (t: number, ctx: CanvasRenderingContext2D) => {
      svg.setCurrentTime(t);
      await raf(); // let the SMIL presentation values settle
      const restore = bakeSmilFrame(svg);
      let frozen: SVGSVGElement;
      try {
        frozen = svg.cloneNode(true) as SVGSVGElement;
      } finally {
        restore();
      }
      // The baked attributes/styles carry the frame; strip the live <animate*>
      // elements so SMIL can't re-run (at t=0) inside the rasterizing <img>.
      for (const a of frozen.querySelectorAll(
        'animate, animateMotion, animateTransform'
      )) {
        a.remove();
      }
      frozen.setAttribute('width', String(Math.round(svgW)));
      frozen.setAttribute('height', String(Math.round(svgH)));

      const url = URL.createObjectURL(
        new Blob([serializer.serializeToString(frozen)], {
          type: 'image/svg+xml;charset=utf-8',
        })
      );
      try {
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
        await img.decode();
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(bgLayer, 0, 0, width, height);
        ctx.drawImage(img, svgX, svgY, svgW, svgH);
        ctx.drawImage(tilesLayer, 0, 0, width, height);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    return { width, height, drawFrameAt, dispose };
  } catch (err) {
    dispose();
    throw err;
  }
}
