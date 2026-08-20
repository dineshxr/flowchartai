'use client';

// A lightweight, non-animated SVG/HTML thumbnail of a template's diagram.
// Used in catalog grids where many cards render at once — cheap to paint and
// fully server-rendered for SEO. The animated version lives on detail pages.
// Icons come from the shared registry, so grid cards show the same real brand
// logos / 3D glyphs as the homepage and the canvas.

import { resolveIcon } from '@/lib/templates/icon-registry';
import type { DiagramData } from '@/lib/templates/types';

const W = 240;
const H = 320;

interface Tile {
  key: string;
  x: number;
  y: number;
  size: number;
  center?: boolean;
  flush?: boolean;
  icon: React.ReactNode;
}

interface Edge {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Mini chart silhouettes for chart templates (bars / chart-line / donut) — so
// grid cards show an actual chart, not the generic radial fallback.
type ChartKind = 'bars' | 'chart-line' | 'donut';

interface ChartGeom {
  kind: ChartKind;
  bars?: Array<{ x: number; y: number; w: number; h: number; color: string }>;
  linePts?: string;
  areaPts?: string;
  points?: Array<{ x: number; y: number }>;
  arcs?: Array<{ d: string; color: string }>;
  baseY?: number;
}

const THUMB_PALETTE = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#0ea5e9',
];

function chartGeom(
  data: DiagramData,
  kind: ChartKind,
  accent: string
): { tiles: Tile[]; chart: ChartGeom } {
  const hub = data as Extract<DiagramData, { center: unknown }>;
  const sats = hub.satellites.slice(0, kind === 'donut' ? 6 : 6);
  const values = sats.map(
    (s, i) =>
      (typeof s.value === 'number' && s.value > 0 ? s.value : 0) ||
      [62, 84, 45, 95, 58, 76][i % 6]
  );
  const palette = [accent, ...THUMB_PALETTE.filter((c) => c !== accent)];
  const ci = resolveIcon(hub.center.icon, hub.center.label, true);
  const tiles: Tile[] = [];

  if (kind === 'donut') {
    const cx = W / 2;
    const cy = 150;
    const r = 66;
    const total = values.reduce((a, b) => a + b, 0) || 1;
    const gap = 0.06;
    let angle = -Math.PI / 2;
    const arcs: ChartGeom['arcs'] = [];
    // Fixed precision — trig results can differ in the last ulp between the
    // server and client, which trips React hydration on the path `d` string.
    const f = (n: number) => n.toFixed(2);
    values.forEach((v, i) => {
      const sweep = (v / total) * Math.PI * 2 - gap;
      const a0 = angle + gap / 2;
      const a1 = a0 + Math.max(sweep, 0.03);
      arcs.push({
        d: `M ${f(cx + Math.cos(a0) * r)} ${f(cy + Math.sin(a0) * r)} A ${r} ${r} 0 ${
          a1 - a0 > Math.PI ? 1 : 0
        } 1 ${f(cx + Math.cos(a1) * r)} ${f(cy + Math.sin(a1) * r)}`,
        color: palette[i % palette.length],
      });
      angle = a0 + (v / total) * Math.PI * 2 - gap / 2;
    });
    tiles.push({
      key: 'center',
      x: cx,
      y: cy,
      size: 52,
      center: true,
      flush: ci.flush || ci.kind === 'brand',
      icon: ci.node,
    });
    sats.slice(0, 5).forEach((s, i) => {
      const si = resolveIcon(s.icon, s.label);
      const gapX = W / (Math.min(sats.length, 5) + 1);
      tiles.push({
        key: `sat-${i}`,
        x: gapX * (i + 1),
        y: 276,
        size: 30,
        flush: si.flush,
        icon: si.node,
      });
    });
    return { tiles, chart: { kind, arcs } };
  }

  const plotL = 30;
  const plotR = W - 30;
  const baseY = 236;
  const plotTop = 92;
  const vmax = Math.max(...values, 1);
  const step = (plotR - plotL) / values.length;
  tiles.push({
    key: 'center',
    x: 44,
    y: 46,
    size: 44,
    center: true,
    flush: ci.flush || ci.kind === 'brand',
    icon: ci.node,
  });
  sats.forEach((s, i) => {
    const si = resolveIcon(s.icon, s.label);
    tiles.push({
      key: `sat-${i}`,
      x: plotL + step * (i + 0.5),
      y: 272,
      size: 30,
      flush: si.flush,
      icon: si.node,
    });
  });

  if (kind === 'bars') {
    const barW = Math.min(step * 0.56, 34);
    return {
      tiles,
      chart: {
        kind,
        baseY,
        bars: values.map((v, i) => {
          const h = Math.max((v / vmax) * (baseY - plotTop), 12);
          return {
            x: plotL + step * (i + 0.5) - barW / 2,
            y: baseY - h,
            w: barW,
            h,
            color: palette[i % palette.length],
          };
        }),
      },
    };
  }

  const pts = values.map((v, i) => ({
    x: Number((plotL + step * (i + 0.5)).toFixed(2)),
    y: Number(
      (baseY - Math.max((v / vmax) * (baseY - plotTop), 10)).toFixed(2)
    ),
  }));
  const linePts = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPts = `${linePts} ${pts[pts.length - 1].x},${baseY} ${pts[0].x},${baseY}`;
  return {
    tiles,
    chart: { kind, baseY, linePts, areaPts, points: pts },
  };
}

// Mini isometric cube-staircase silhouette for iso-steps templates — grid
// cards show the actual stacked-cubes visual instead of the radial fallback.
interface IsoThumbGeom {
  faces: Array<{ d: string; fill: string }>;
  labels: Array<{ tf: string; x: number; y: number; t: string; fs: number }>;
  stroke: string;
}

/** amt > 0 tints toward white, amt < 0 shades toward black. */
function isoThumbShade(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h.padEnd(6, '0');
  const n = Number.parseInt(full.slice(0, 6), 16);
  const t = amt > 0 ? 255 : 0;
  const pMix = Math.abs(amt);
  const ch = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v + (t - v) * pMix)));
  return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

function isoThumb(
  data: DiagramData,
  accent: string
): { tiles: Tile[]; iso: IsoThumbGeom } {
  const hub = data as Extract<DiagramData, { center: unknown }>;
  const sats = hub.satellites.slice(0, 15);
  const N = Math.max(sats.length, 1);
  const C = Math.max(2, Math.ceil((Math.sqrt(8 * N + 1) - 1) / 2));
  const cells: Array<{ c: number; h: number; label: string }> = [];
  let k = 0;
  for (let h = 0; k < N; h++) {
    const rowW = Math.max(1, C - h);
    for (let c = 0; c < rowW && k < N; c++) {
      cells.push({ c, h, label: sats[k].label });
      k++;
    }
  }
  const col0H = cells.filter((x) => x.c === 0).length;
  const Htot = col0H + 1;
  const unitsW = (C + 1) * 0.866;
  const unitsH = Htot + 0.5 + C * 0.5;
  const s = Math.min(204 / unitsW, 266 / unitsH);
  const x0 = (W - unitsW * s) / 2;
  const y0 = (H - unitsH * s) / 2 + (Htot + 0.5) * s;
  // Fixed precision — mirrors the chart thumbs' hydration-safe rounding.
  const f = (n: number) => Number(n.toFixed(2));
  const ux = 0.866 * s;
  const uy = 0.5 * s;
  const facesFor = (x: number, y: number) => ({
    top: `M ${f(x)} ${f(y - s)} L ${f(x + ux)} ${f(y - s + uy)} L ${f(x + 2 * ux)} ${f(y - s)} L ${f(x + ux)} ${f(y - s - uy)} Z`,
    side: `M ${f(x + ux)} ${f(y + uy)} L ${f(x + 2 * ux)} ${f(y)} L ${f(x + 2 * ux)} ${f(y - s)} L ${f(x + ux)} ${f(y - s + uy)} Z`,
    front: `M ${f(x)} ${f(y)} L ${f(x + ux)} ${f(y + uy)} L ${f(x + ux)} ${f(y - s + uy)} L ${f(x)} ${f(y - s)} Z`,
  });
  const faces: IsoThumbGeom['faces'] = [];
  const labels: IsoThumbGeom['labels'] = [];
  const frontFill = accent;
  const sideFill = isoThumbShade(accent, -0.16);
  const topFill = isoThumbShade(accent, 0.18);
  for (const cell of [...cells].sort((a, b) => a.c - b.c || a.h - b.h)) {
    const x = x0 + cell.c * ux;
    const y = y0 + cell.c * uy - cell.h * s;
    const q = facesFor(x, y);
    faces.push(
      { d: q.top, fill: topFill },
      { d: q.side, fill: sideFill },
      { d: q.front, fill: frontFill }
    );
    if (cell.label)
      labels.push({
        tf: `matrix(0.866,0.5,0,1,${f(x)},${f(y - s)})`,
        x: f(s * 0.5),
        y: f(s * 0.64),
        t: cell.label,
        fs: f(s * 0.36 * Math.min(1, 2.6 / cell.label.length)),
      });
  }
  const lp = facesFor(x0, y0 - col0H * s);
  faces.push(
    { d: lp.top, fill: '#ffffff' },
    { d: lp.side, fill: '#EDEBE6' },
    { d: lp.front, fill: '#FBFAF7' }
  );
  const ci = resolveIcon(hub.center.icon, hub.center.label);
  const tiles: Tile[] = [
    {
      key: 'center',
      x: f(x0 + ux * 0.62),
      y: f(y0 - col0H * s - s * 0.42),
      size: f(s * 0.56),
      flush: ci.flush || ci.kind === 'brand',
      icon: ci.node,
    },
  ];
  return {
    tiles,
    iso: { faces, labels, stroke: isoThumbShade(accent, -0.62) },
  };
}

function computeLayout(data: DiagramData): { tiles: Tile[]; edges: Edge[] } {
  const tiles: Tile[] = [];
  const edges: Edge[] = [];

  if ('layout' in data && data.layout === 'tree') {
    const root = data.root;
    const rootX = W / 2;
    const rootY = 52;
    const ri = resolveIcon(root.icon, root.label, true);
    tiles.push({
      key: 'root',
      x: rootX,
      y: rootY,
      size: 56,
      center: true,
      flush: ri.flush || ri.kind === 'brand',
      icon: ri.node,
    });
    const level1 = (root.children || []).slice(0, 4);
    const l1Y = 176;
    const l1Gap = W / (level1.length + 1);
    level1.forEach((child, i) => {
      const x = l1Gap * (i + 1);
      const cIcon = resolveIcon(child.icon, child.label);
      edges.push({ key: `e1-${i}`, x1: rootX, y1: rootY, x2: x, y2: l1Y });
      tiles.push({
        key: `c${i}`,
        x,
        y: l1Y,
        size: 42,
        flush: cIcon.flush,
        icon: cIcon.node,
      });
      const l2 = (child.children || []).slice(0, 3);
      if (l2.length) {
        const l2Y = 276;
        const gap = 40;
        const startX = x - ((l2.length - 1) * gap) / 2;
        l2.forEach((gc, j) => {
          const gx = Math.max(22, Math.min(W - 22, startX + gap * j));
          const gi = resolveIcon(gc.icon, gc.label);
          edges.push({ key: `e2-${i}-${j}`, x1: x, y1: l1Y, x2: gx, y2: l2Y });
          tiles.push({
            key: `c${i}-${j}`,
            x: gx,
            y: l2Y,
            size: 34,
            flush: gi.flush,
            icon: gi.node,
          });
        });
      }
    });
    return { tiles, edges };
  }

  const hub = data as Extract<DiagramData, { center: unknown }>;
  const cx = W / 2;
  const cy = 164;
  const rx = 80;
  const ry = 112;
  const sats = hub.satellites.slice(0, 7);
  const n = sats.length;
  sats.forEach((sat, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * rx;
    const y = cy + Math.sin(angle) * ry;
    const si = resolveIcon(sat.icon, sat.label);
    edges.push({ key: `e-${i}`, x1: cx, y1: cy, x2: x, y2: y });
    tiles.push({
      key: `sat-${i}`,
      x,
      y,
      size: 42,
      flush: si.flush,
      icon: si.node,
    });
  });
  const ci = resolveIcon(hub.center.icon, hub.center.label, true);
  tiles.push({
    key: 'center',
    x: cx,
    y: cy,
    size: 60,
    center: true,
    flush: ci.flush || ci.kind === 'brand',
    icon: ci.node,
  });
  return { tiles, edges };
}

export function StaticDiagramThumb({
  data,
  accent = '#8b5cf6',
  layout,
}: {
  data: DiagramData;
  accent?: string;
  /** Pinned template layout — chart layouts get a real chart silhouette. */
  layout?: string;
}) {
  const isChart =
    (layout === 'bars' || layout === 'chart-line' || layout === 'donut') &&
    'center' in data;
  const chartResult = isChart
    ? chartGeom(data, layout as ChartKind, accent)
    : null;
  const isoResult =
    layout === 'iso-steps' && 'center' in data ? isoThumb(data, accent) : null;
  const base = chartResult || isoResult ? null : computeLayout(data);
  const tiles = chartResult?.tiles ?? isoResult?.tiles ?? base?.tiles ?? [];
  const edges = base?.edges ?? [];
  const chart = chartResult?.chart;
  const iso = isoResult?.iso;

  return (
    <div
      className="relative h-full w-full"
      style={{
        background: `radial-gradient(120% 120% at 50% 0%, ${accent}14 0%, transparent 60%)`,
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {edges.map((e) => (
          <line
            key={e.key}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={accent}
            strokeOpacity={0.3}
            strokeWidth={1.5}
          />
        ))}
        {iso?.faces.map((fa, i) => (
          <path
            key={`iso-${i}`}
            d={fa.d}
            fill={fa.fill}
            stroke={iso.stroke}
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        ))}
        {iso?.labels.map((l, i) => (
          <g key={`isol-${i}`} transform={l.tf}>
            <text
              x={l.x}
              y={l.y}
              textAnchor="middle"
              fontWeight={800}
              fontSize={l.fs}
              fill="#ffffff"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {l.t}
            </text>
          </g>
        ))}
        {chart?.bars?.map((b, i) => (
          <rect
            key={`bar-${i}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={4}
            fill={b.color}
            fillOpacity={0.9}
          />
        ))}
        {chart?.kind === 'chart-line' && chart.areaPts && (
          <polygon points={chart.areaPts} fill={accent} fillOpacity={0.12} />
        )}
        {chart?.kind === 'chart-line' && chart.linePts && (
          <polyline
            points={chart.linePts}
            fill="none"
            stroke={accent}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {chart?.kind === 'chart-line' &&
          chart.points?.map((p, i) => (
            <circle
              key={`pt-${i}`}
              cx={p.x}
              cy={p.y}
              r={4.5}
              fill="#ffffff"
              stroke={accent}
              strokeWidth={2}
            />
          ))}
        {(chart?.kind === 'bars' || chart?.kind === 'chart-line') &&
          chart.baseY && (
            <line
              x1={26}
              y1={chart.baseY}
              x2={W - 26}
              y2={chart.baseY}
              stroke="rgba(15,42,62,0.28)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          )}
        {chart?.arcs?.map((a, i) => (
          <path
            key={`arc-${i}`}
            d={a.d}
            fill="none"
            stroke={a.color}
            strokeWidth={20}
          />
        ))}
      </svg>
      {tiles.map((t) => {
        const leftPct = (t.x / W) * 100;
        const topPct = (t.y / H) * 100;
        const flush = !!t.flush;
        return (
          <div
            key={t.key}
            className="absolute flex items-center justify-center rounded-xl"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              width: t.size,
              height: t.size,
              transform: 'translate(-50%, -50%)',
              background: flush ? 'transparent' : t.center ? accent : 'white',
              border: flush
                ? 'none'
                : t.center
                  ? 'none'
                  : '1px solid rgba(0,0,0,0.08)',
              boxShadow: flush
                ? '0 4px 10px rgba(15,42,62,0.18)'
                : t.center
                  ? `0 6px 18px ${accent}55`
                  : '0 1px 3px rgba(0,0,0,0.06)',
              color: t.center ? 'white' : '#475569',
            }}
          >
            <div
              style={{
                width: flush ? t.size : t.size * 0.5,
                height: flush ? t.size : t.size * 0.5,
              }}
              className="flex items-center justify-center"
            >
              {t.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
}
