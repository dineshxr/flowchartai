'use client';

// Dev-only isometric cube-staircase renderer ("iso" format) for social
// exports — numbered cubes build up step by step, a logo cube lands on top,
// hold, fade, loop. Everything is data-driven from iso-concepts.json served
// by /api/dev-social?action=iso (404s in production): cube count, columns,
// labels, accent color, top-cube logo (icon-registry key), heading lines,
// timing. Drive per-concept via /en/dev-iso?show=<slug>&w=&h=&holdoff=ms —
// captured by the social-campaign renderer (scripts/social-tiktok) which
// screenshots `.iso-stage` while the CSS animation plays in real time.

import { iconNode } from '@/lib/templates/icon-registry';
import { useEffect, useState } from 'react';

interface IsoConcept {
  slug: string;
  /** big dark heading line, right of the staircase (optional) */
  heading?: string;
  /** second heading line, rendered in the accent color (optional) */
  headingAccent?: string;
  /** icon-registry key for the white top cube (brand logo, 3D key, glyph) */
  logo?: string;
  /** how many numbered cubes */
  count: number;
  /** staircase base width in cubes */
  columns: number;
  /** face labels; defaults to zero-padded 01..NN */
  labels?: string[];
  accent?: string;
  /** dotted paper background */
  dots?: boolean;
  /** seconds between cube pops */
  stepSec?: number;
  /** seconds everything stays assembled before the loop fades */
  holdSec?: number;
}

// ---- tiny color helpers -----------------------------------------------------
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const v =
    h.length === 3
      ? h.split('').map((c) => Number.parseInt(c + c, 16))
      : [
          Number.parseInt(h.slice(0, 2), 16),
          Number.parseInt(h.slice(2, 4), 16),
          Number.parseInt(h.slice(4, 6), 16),
        ];
  return [v[0], v[1], v[2]];
}
const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
/** amt > 0 tints toward white, amt < 0 shades toward black */
function mix(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  const t = amt > 0 ? 255 : 0;
  const p = Math.abs(amt);
  return `rgb(${clamp(r + (t - r) * p)},${clamp(g + (t - g) * p)},${clamp(b + (t - b) * p)})`;
}

// ---- geometry ---------------------------------------------------------------
interface Cell {
  c: number;
  h: number;
  label: string;
}

/** rows shrink by one cube per level: bottom row `columns` wide, next
 *  `columns-1`, … — cube k (0-based) filled row-major, bottom-up. */
function layoutCells(count: number, columns: number, labels: string[]): Cell[] {
  const cells: Cell[] = [];
  let k = 0;
  for (let h = 0; k < count; h++) {
    const rowWidth = Math.max(1, columns - h);
    for (let c = 0; c < rowWidth && k < count; c++) {
      cells.push({ c, h, label: labels[k] ?? String(k + 1) });
      k++;
    }
  }
  return cells;
}

function IsoStairs({
  concept,
  W,
  H,
}: {
  concept: IsoConcept;
  W: number;
  H: number;
}) {
  const accent = concept.accent || '#E2612E';
  const outline = mix(accent, -0.62);
  const faceFront = accent;
  const faceSide = mix(accent, -0.16);
  const faceTop = mix(accent, 0.18);

  const pad = String(concept.count).length > 1 ? 2 : 1;
  const autoLabels = Array.from({ length: concept.count }, (_, i) =>
    String(i + 1).padStart(pad, '0')
  );
  const labels = concept.labels?.length ? concept.labels : autoLabels;
  const cells = layoutCells(concept.count, concept.columns, labels);
  const colHeights = new Map<number, number>();
  for (const cell of cells)
    colHeights.set(cell.c, Math.max(colHeights.get(cell.c) ?? 0, cell.h + 1));
  const topH = colHeights.get(0) ?? 1; // logo cube sits on the leftmost column

  const hasHeading = Boolean(concept.heading || concept.headingAccent);
  const C = concept.columns;
  // scene bbox in cube-edge units (see face math below)
  const unitsW = (C + 1) * 0.866;
  const unitsH = topH + 1.5 + C * 0.5 + (concept.logo ? 1 : 0);
  const sceneFrac = hasHeading ? 0.6 : 0.9;
  const s = Math.min((W * sceneFrac * 0.92) / unitsW, (H * 0.86) / unitsH);

  const ux = 0.866 * s;
  const uy = 0.5 * s;
  // screen anchor of cube (c,h)'s front-bottom-left vertex
  const px = (c: number) => c * ux;
  const py = (c: number, h: number) => c * uy - h * s;
  const sceneW = unitsW * s;
  const sceneH = unitsH * s;
  const originX = (hasHeading ? W * 0.05 : (W - sceneW) / 2) + 0;
  const originY = (H - sceneH) / 2 + (topH + (concept.logo ? 1 : 0) + 1.5) * s;

  // ---- animation timeline (one loop = P seconds) ----------------------------
  const lead = 0.9;
  const step = concept.stepSec ?? 0.16;
  const hold = concept.holdSec ?? 2.2;
  const logoDur = concept.logo ? 0.55 : 0;
  const P = lead + cells.length * step + logoDur + hold + 0.6;
  const pct = (t: number) => ((t / P) * 100).toFixed(2);

  let css = `@keyframes isoFade{0%,90%{opacity:1}96%,100%{opacity:0}}
.iso-root{animation:isoFade ${P}s linear infinite}
.iso-stage:not(.iso-ready) .iso-anim{animation-play-state:paused!important}\n`;
  cells.forEach((_, k) => {
    const t0 = lead + k * step;
    css += `@keyframes isoPop${k}{0%,${pct(t0)}%{opacity:0;transform:translateY(${s * 0.3}px)}${pct(t0 + 0.3)}%{opacity:1;transform:translateY(${-s * 0.05}px)}${pct(t0 + 0.46)}%,100%{opacity:1;transform:none}}
.iso-cube-${k}{animation:isoPop${k} ${P}s linear infinite}\n`;
  });
  if (concept.logo) {
    const t0 = lead + cells.length * step + 0.1;
    css += `@keyframes isoLogo{0%,${pct(t0)}%{opacity:0;transform:translateY(${-s * 0.8}px)}${pct(t0 + 0.32)}%{opacity:1;transform:translateY(${s * 0.07}px)}${pct(t0 + 0.5)}%,100%{opacity:1;transform:none}}
.iso-cube-logo{animation:isoLogo ${P}s linear infinite}\n`;
  }

  const sw = Math.max(2.5, s * 0.052); // outline width

  const face = (pts: [number, number][], fill: string) => (
    <path
      d={`M${pts.map((p) => p.join(',')).join('L')}Z`}
      fill={fill}
      stroke={outline}
      strokeWidth={sw}
      strokeLinejoin="round"
    />
  );

  /** one cube: front face (labelled), right side face, top face */
  const cube = (
    c: number,
    h: number,
    colors: { front: string; side: string; top: string },
    content?: React.ReactNode
  ) => {
    const x = px(c);
    const y = py(c, h);
    const u: [number, number] = [ux, uy];
    const d: [number, number] = [ux, -uy];
    const w: [number, number] = [0, -s];
    const add = (
      p: [number, number],
      ...vs: [number, number][]
    ): [number, number] => vs.reduce((a, v) => [a[0] + v[0], a[1] + v[1]], p);
    const P0: [number, number] = [x, y];
    return (
      <>
        {face(
          [add(P0, w), add(P0, u, w), add(P0, u, d, w), add(P0, d, w)],
          colors.top
        )}
        {face(
          [add(P0, u), add(P0, u, d), add(P0, u, d, w), add(P0, u, w)],
          colors.side
        )}
        {face([P0, add(P0, u), add(P0, u, w), add(P0, w)], colors.front)}
        {content && (
          <g transform={`matrix(0.866,0.5,0,1,${x},${y - s})`}>{content}</g>
        )}
      </>
    );
  };

  return (
    <div
      className="iso-root relative h-full w-full"
      style={{
        background: concept.dots === false ? '#FAFAF8' : undefined,
        backgroundColor: '#FAFAF8',
        backgroundImage:
          concept.dots === false
            ? undefined
            : 'radial-gradient(circle, #C9CAD6 1.5px, transparent 1.8px)',
        backgroundSize: '30px 30px',
      }}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: generated keyframes */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg
        className="absolute inset-0"
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
      >
        <g transform={`translate(${originX},${originY})`}>
          {cells.map((cell, k) => {
            const fontSize = s * 0.38 * Math.min(1, 2.6 / cell.label.length);
            return (
              <g key={k} className={`iso-anim iso-cube-${k}`}>
                {cube(
                  cell.c,
                  cell.h,
                  { front: faceFront, side: faceSide, top: faceTop },
                  <text
                    x={s * 0.5}
                    y={s * 0.64}
                    textAnchor="middle"
                    fill="#fff"
                    fontWeight={800}
                    fontSize={fontSize}
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {cell.label}
                  </text>
                )}
              </g>
            );
          })}
          {concept.logo && (
            <g className="iso-anim iso-cube-logo">
              {cube(
                0,
                topH,
                { front: '#FBFAF7', side: '#EDEBE6', top: '#FFFFFF' },
                <foreignObject
                  x={s * 0.15}
                  y={s * 0.13}
                  width={s * 0.7}
                  height={s * 0.7}
                >
                  <div style={{ width: '100%', height: '100%' }}>
                    {iconNode(concept.logo)}
                  </div>
                </foreignObject>
              )}
            </g>
          )}
        </g>
      </svg>
      {hasHeading && (
        <div
          className="absolute"
          style={{
            right: W * 0.045,
            top: '50%',
            transform: 'translateY(-50%)',
            width: W * 0.36,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: 1.06,
          }}
        >
          {concept.heading && (
            <div
              style={{
                fontSize: W * 0.082,
                fontWeight: 800,
                color: '#232A35',
                letterSpacing: '-0.02em',
              }}
            >
              {concept.heading}
            </div>
          )}
          {concept.headingAccent && (
            <div
              style={{
                fontSize: W * 0.058,
                fontWeight: 800,
                color: accent,
                letterSpacing: '-0.01em',
                marginTop: W * 0.012,
              }}
            >
              {concept.headingAccent}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DevIsoPage() {
  const [concept, setConcept] = useState<IsoConcept | null>(null);
  const [dims, setDims] = useState<{ W: number; H: number }>({
    W: 640,
    H: 640,
  });
  const [ready, setReady] = useState(false);
  const [log, setLog] = useState('idle');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setDims({ W: Number(p.get('w')) || 640, H: Number(p.get('h')) || 640 });
    const show = p.get('show');
    const holdoff = Number(p.get('holdoff')) || 2100;
    if (!show) {
      setLog('pass ?show=<slug>');
      return;
    }
    (async () => {
      const concepts: IsoConcept[] = await (
        await fetch('/api/dev-social?action=iso')
      ).json();
      const found = concepts.find((c) => c.slug === show);
      if (!found) {
        setLog(`unknown slug ${show}`);
        return;
      }
      setConcept(found);
      setLog(`show ${show}`);
      // hold the animation at frame 0 until the renderer's settle wait is
      // nearly over, so capture starts at the beginning of the build-up
      await document.fonts.ready;
      setTimeout(() => setReady(true), holdoff);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <p className="mb-3 font-mono text-xs text-neutral-500">
        dev-iso renderer — {log}
      </p>
      <div
        className={`iso-stage relative overflow-hidden${ready ? ' iso-ready' : ''}`}
        style={{ width: dims.W, height: dims.H }}
      >
        {concept && <IsoStairs concept={concept} W={dims.W} H={dims.H} />}
      </div>
    </div>
  );
}
