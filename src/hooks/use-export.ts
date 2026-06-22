// @/lib/ffmpeg-export (and the heavy ffmpeg.wasm encoder it pulls in) is imported
// DYNAMICALLY inside the GIF/MP4 handlers below. A static import lands @ffmpeg in
// every page bundle that touches this hook — the homepage Hero imports
// EXPORT_PRESETS from here — and @ffmpeg's `new Worker(new URL(...))` can't be
// resolved by `next dev`, which crashed every route. Loading it on demand keeps
// it out of page bundles entirely until the user actually exports a GIF/MP4.
import { domToCanvas, domToDataUrl } from 'modern-screenshot';
import { useState } from 'react';
import { toast } from 'sonner';

// ─── size presets ─────────────────────────────────────────────────────────────

export type ExportPreset =
  | 'original'
  | 'square'
  | 'story'
  | 'portrait'
  | 'landscape'
  | 'widescreen';

export const EXPORT_PRESETS: Record<
  ExportPreset,
  { label: string; w?: number; h?: number }
> = {
  original: { label: 'Original size' },
  square: { label: '1:1 Square (1080×1080)', w: 1080, h: 1080 },
  story: { label: '9:16 Story (1080×1920)', w: 1080, h: 1920 },
  portrait: { label: '4:5 Portrait (1080×1350)', w: 1080, h: 1350 },
  landscape: { label: '16:9 Landscape (1920×1080)', w: 1920, h: 1080 },
  widescreen: { label: '4:3 Widescreen (1440×1080)', w: 1440, h: 1080 },
};

// ─── watermark ────────────────────────────────────────────────────────────────

function drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const fontSize = Math.max(14, Math.round(Math.min(w, h) * 0.022));
  const pad = Math.round(fontSize * 1.1);
  const text = 'infogiph.com';
  ctx.save();
  ctx.font = `600 ${fontSize}px Geist, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'right';
  const tw = ctx.measureText(text).width;
  const bw = tw + pad;
  const bh = fontSize + pad * 0.5;
  const bx = w - bw - pad * 0.6;
  const by = h - bh - pad * 0.6;
  const r = Math.min(bh / 2, 10);
  ctx.fillStyle = 'rgba(15,23,42,0.72)';
  ctx.beginPath();
  ctx.moveTo(bx + r, by);
  ctx.lineTo(bx + bw - r, by);
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
  ctx.lineTo(bx + bw, by + bh - r);
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
  ctx.lineTo(bx + r, by + bh);
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
  ctx.lineTo(bx, by + r);
  ctx.quadraticCurveTo(bx, by, bx + r, by);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(text, bx + bw - pad * 0.5, by + bh - pad * 0.25);
  ctx.restore();
}

// ─── finalise (preset + resolution + watermark) ───────────────────────────────

/**
 * Per-export options. Defaults match the free tier (1080p, watermark on); paid
 * plans pass a higher `resolutionScale` (2K/4K) and `watermark: false`.
 */
export interface ExportOptions {
  /** Multiplier on the preset dimensions: 1 = 1080p, 1.34 = 2K, 2 = 4K. */
  resolutionScale: number;
  /** Whether to stamp the infogiph.com watermark. */
  watermark: boolean;
}

const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  resolutionScale: 1,
  watermark: true,
};

function finaliseCanvas(
  source: HTMLCanvasElement,
  preset: ExportPreset,
  opts: ExportOptions = DEFAULT_EXPORT_OPTIONS
): HTMLCanvasElement {
  const p = EXPORT_PRESETS[preset];
  const res = Math.max(1, opts.resolutionScale || 1);
  const target = document.createElement('canvas');
  target.width = Math.round((p.w ?? source.width) * res);
  target.height = Math.round((p.h ?? source.height) * res);
  const ctx = target.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, target.width, target.height);
  const scale = Math.min(
    target.width / source.width,
    target.height / source.height
  );
  const dw = source.width * scale;
  const dh = source.height * scale;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    source,
    (target.width - dw) / 2,
    (target.height - dh) / 2,
    dw,
    dh
  );
  if (opts.watermark) drawWatermark(ctx, target.width, target.height);
  return target;
}

// ─── capture helpers ──────────────────────────────────────────────────────────

async function capture(el: HTMLElement, scale = 2): Promise<HTMLCanvasElement> {
  return domToCanvas(el, {
    scale,
    backgroundColor: '#ffffff',
    debug: false,
  });
}

// CSS/geometry presentation values driven by SMIL <animate> that we bake onto
// the target element so the serialised DOM clone reflects the paused frame.
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

/**
 * Bake the CURRENT SMIL presentation state of an SVG (after pauseAnimations +
 * setCurrentTime) directly onto the animated elements, so a DOM-to-canvas clone
 * renders the exact paused frame. Crucially this includes the consolidated
 * transform produced by <animateMotion>/<animateTransform> (the traveling
 * dots/arrows) — which getComputedStyle alone does NOT expose. Returns a
 * function that restores the original DOM.
 */
function bakeSmilFrame(svg: SVGSVGElement): () => void {
  const restores: Array<() => void> = [];
  const targets = new Set<Element>();
  for (const a of svg.querySelectorAll(
    'animate, animateMotion, animateTransform'
  )) {
    if (a.parentElement) targets.add(a.parentElement);
  }

  for (const el of targets) {
    // 1) Consolidated transform — captures animateMotion + animateTransform.
    try {
      const consolidated = (
        el as SVGGraphicsElement
      ).transform?.animVal?.consolidate?.();
      if (consolidated) {
        const m = consolidated.matrix;
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

    // 2) Animated geometry / opacity / dash presentation values.
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

// ─── hook ────────────────────────────────────────────────────────────────────

export function useFlowchartExport(
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const download = (data: string | Blob, filename: string) => {
    const a = document.createElement('a');
    a.download = filename;
    a.href = typeof data === 'string' ? data : URL.createObjectURL(data);
    a.click();
    if (typeof data !== 'string')
      setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
  };

  // ── PNG ──────────────────────────────────────────────────────────────────────

  const exportPNG = async (
    title: string,
    preset: ExportPreset = 'original',
    opts: ExportOptions = DEFAULT_EXPORT_OPTIONS
  ) => {
    if (!containerRef.current) return;
    setIsExporting(true);
    setExportProgress(20);
    try {
      const raw = await capture(
        containerRef.current,
        Math.round(3 * Math.max(1, opts.resolutionScale))
      );
      const out = finaliseCanvas(raw, preset, opts);
      setExportProgress(100);
      download(out.toDataURL('image/png'), `${title || 'infogiph'}.png`);
      toast.success('PNG exported');
    } catch (err) {
      console.error('[export:png]', err);
      toast.error('Failed to export PNG');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // ── SVG ──────────────────────────────────────────────────────────────────────

  const exportSVG = async (
    title: string,
    preset: ExportPreset = 'original',
    opts: ExportOptions = DEFAULT_EXPORT_OPTIONS
  ) => {
    if (!containerRef.current) return;
    setIsExporting(true);
    setExportProgress(40);
    try {
      const dataUrl = await domToDataUrl(containerRef.current, {
        scale: Math.round(2 * Math.max(1, opts.resolutionScale)),
        backgroundColor: '#ffffff',
      });
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error('SVG decode failed'));
        img.src = dataUrl;
      });
      const raw = document.createElement('canvas');
      raw.width = img.naturalWidth || containerRef.current.clientWidth * 2;
      raw.height = img.naturalHeight || containerRef.current.clientHeight * 2;
      raw.getContext('2d')?.drawImage(img, 0, 0, raw.width, raw.height);
      const out = finaliseCanvas(raw, preset, opts);

      const wrapper = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${out.width}" height="${out.height}" viewBox="0 0 ${out.width} ${out.height}">
  <image width="${out.width}" height="${out.height}" href="${out.toDataURL('image/png')}" />
</svg>`;
      download(
        new Blob([wrapper], { type: 'image/svg+xml;charset=utf-8' }),
        `${title || 'infogiph'}.svg`
      );
      setExportProgress(100);
      toast.success('SVG exported');
    } catch (err) {
      console.error('[export:svg]', err);
      toast.error('Failed to export SVG');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // ── Frame capture ───────────────────────────────────────────────────────────
  // Returns the animation as an array of canvases plus the fps to play them
  // back at. SMIL animations are seeked deterministically (exact, smooth);
  // framer-motion / CSS animations are grabbed in real time (their values live
  // on inline styles, so a plain capture reflects the current frame).

  const captureFrames = async (
    fps: number,
    durationSecs: number
  ): Promise<{ frames: HTMLCanvasElement[]; fps: number }> => {
    if (!containerRef.current) return { frames: [], fps };
    const container = containerRef.current;
    const svg = container.querySelector('svg') as SVGSVGElement | null;

    const hasSmil =
      !!svg &&
      svg.querySelectorAll('animate, animateMotion, animateTransform').length >
        0;
    const canSeek =
      hasSmil &&
      typeof svg!.pauseAnimations === 'function' &&
      typeof svg!.setCurrentTime === 'function' &&
      typeof svg!.unpauseAnimations === 'function';

    const total = Math.max(1, Math.round(fps * durationSecs));
    const frames: HTMLCanvasElement[] = [];

    if (canSeek) {
      svg!.pauseAnimations();
      try {
        for (let i = 0; i < total; i++) {
          svg!.setCurrentTime(i / fps);
          await raf();
          await raf();
          const restore = bakeSmilFrame(svg!);
          try {
            frames.push(await capture(container, 2));
          } finally {
            restore();
          }
          setExportProgress(Math.round(((i + 1) / total) * 45));
        }
      } finally {
        try {
          svg!.unpauseAnimations();
        } catch {
          // ignore
        }
      }
      return { frames, fps };
    }

    // Real-time capture (framer-motion / CSS). Grab as fast as possible and
    // measure the true fps so playback speed matches the live animation.
    const start = performance.now();
    for (let i = 0; i < total; i++) {
      frames.push(await capture(container, 2));
      setExportProgress(Math.round(((i + 1) / total) * 45));
      const elapsed = performance.now() - start;
      const expected = (i + 1) * (1000 / fps);
      if (elapsed < expected) await delay(expected - elapsed);
    }
    const seconds = (performance.now() - start) / 1000 || 1;
    const realFps = Math.max(
      1,
      Math.min(fps, Math.round(frames.length / seconds))
    );
    return { frames, fps: realFps };
  };

  // Apply preset sizing + watermark to every frame, then encode to PNG blobs.
  const framesToPngBlobs = async (
    rawFrames: HTMLCanvasElement[],
    preset: ExportPreset,
    opts: ExportOptions
  ): Promise<Blob[]> => {
    const blobs: Blob[] = [];
    for (let i = 0; i < rawFrames.length; i++) {
      const out = finaliseCanvas(rawFrames[i], preset, opts);
      const blob = await new Promise<Blob>((resolve, reject) =>
        out.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
          'image/png'
        )
      );
      blobs.push(blob);
      setExportProgress(45 + Math.round(((i + 1) / rawFrames.length) * 15));
    }
    return blobs;
  };

  // ── GIF (ffmpeg.wasm) ─────────────────────────────────────────────────────────

  const exportGIF = async (
    title: string,
    preset: ExportPreset = 'original',
    opts: ExportOptions = DEFAULT_EXPORT_OPTIONS
  ) => {
    if (!containerRef.current) return;
    setIsExporting(true);
    setExportProgress(0);
    try {
      toast.info('Rendering GIF — this can take a moment…');
      const { frames: rawFrames, fps } = await captureFrames(15, 3.4);
      if (!rawFrames.length) throw new Error('No frames captured');
      const blobs = await framesToPngBlobs(rawFrames, preset, opts);

      const { getFFmpeg, encodeGif } = await import('@/lib/ffmpeg-export');
      const ff = await getFFmpeg();
      const onProgress = ({ progress }: { progress: number }) =>
        setExportProgress(60 + Math.round(Math.min(progress, 1) * 38));
      ff.on('progress', onProgress);
      try {
        const gif = await encodeGif(blobs, fps);
        download(gif, `${title || 'infogiph'}.gif`);
      } finally {
        ff.off('progress', onProgress);
      }
      setExportProgress(100);
      toast.success('GIF exported');
    } catch (err) {
      console.error('[export:gif]', err);
      toast.error('Failed to export GIF', {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // ── MP4 (ffmpeg.wasm, H.264) ───────────────────────────────────────────────────

  const exportMP4 = async (
    title: string,
    preset: ExportPreset = 'original',
    opts: ExportOptions = DEFAULT_EXPORT_OPTIONS
  ) => {
    if (!containerRef.current) return;
    setIsExporting(true);
    setExportProgress(0);
    try {
      toast.info('Rendering MP4 — this can take a moment…');
      const { frames: rawFrames, fps } = await captureFrames(24, 3.4);
      if (!rawFrames.length) throw new Error('No frames captured');
      const blobs = await framesToPngBlobs(rawFrames, preset, opts);

      const { getFFmpeg, encodeMp4 } = await import('@/lib/ffmpeg-export');
      const ff = await getFFmpeg();
      const onProgress = ({ progress }: { progress: number }) =>
        setExportProgress(60 + Math.round(Math.min(progress, 1) * 38));
      ff.on('progress', onProgress);
      try {
        const mp4 = await encodeMp4(blobs, fps);
        download(mp4, `${title || 'infogiph'}.mp4`);
      } finally {
        ff.off('progress', onProgress);
      }
      setExportProgress(100);
      toast.success('MP4 exported');
    } catch (err) {
      console.error('[export:mp4]', err);
      toast.error('Failed to export MP4', {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return {
    exportPNG,
    exportSVG,
    exportGIF,
    exportMP4,
    isExporting,
    exportProgress,
  };
}

// ─── utils ──────────────────────────────────────────────────────────────────

const raf = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
