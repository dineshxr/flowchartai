'use client';

import {
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

export type PreviewMode = 'dots' | 'beams' | 'pulses' | 'arrows';

export interface PreviewNode {
  key: string;
  icon: ReactNode;
  label?: string;
  /**
   * Render the icon edge-to-edge with no white tile chrome — for self-contained
   * "3D" app-icon glyphs that bring their own background and depth.
   */
  flush?: boolean;
  /**
   * Pure-SVG icon (brand logo / tinted glyph) for layouts that draw the node
   * INSIDE the animated <svg> (orbit satellites). HTML icons can't go there —
   * the export pipeline re-rasterizes the SVG standalone, with no CSS. When
   * absent, the orbit renderer draws a letter tile from `letter` + `tint`.
   */
  svgIcon?: ReactNode;
  letter?: string;
  tint?: string;
  /**
   * Numeric magnitude for the chart layouts (bars / chart-line / donut).
   * Optional — when absent those layouts synthesize a deterministic series.
   */
  value?: number;
  /** Display unit for `value` — "%", "$", "k", "users"… */
  unit?: string;
}

export interface TreeNode extends PreviewNode {
  children?: TreeNode[];
}

interface SpecBase {
  mode: PreviewMode;
  bg?: string;
  accent?: string;
}

export type PreviewSpec =
  | (SpecBase & {
      layout: 'hub-lr';
      left: PreviewNode[];
      right: PreviewNode[];
      center: PreviewNode;
    })
  | (SpecBase & {
      layout: 'tree';
      root: TreeNode;
    })
  | (SpecBase & {
      layout: 'pipeline';
      nodes: PreviewNode[];
    })
  | (SpecBase & {
      layout: 'radial';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      layout: 'orbit';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Circular process loop — ordered steps around a ring, arrows closing it. */
      layout: 'cycle';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Ascending staircase — ordered steps climbing to the goal (center). */
      layout: 'steps';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Narrowing funnel — stages top→bottom, center = the outcome below the spout. */
      layout: 'funnel';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Layered pyramid — satellites are layers BASE-FIRST, center = the capstone. */
      layout: 'pyramid';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** 2×2 matrix — cells in reading order [TL, TR, BL, BR]; center optional at the crossing. */
      layout: 'quadrant';
      center?: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Comparison columns — first half vs second half, center between them. */
      layout: 'columns';
      center?: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Milestone timeline — alternating above/below a baseline; center = the subject at the start. */
      layout: 'timeline';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Iceberg — surface items above the waterline, the hidden mass below; center = the tip. */
      layout: 'iceberg';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Isometric cube staircase — satellites are numbered cubes climbing
       *  left-high to right-low; center = the white logo cube on top, its
       *  label rendered as the big heading beside the stack. */
      layout: 'iso-steps';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Animated bar chart — one bar per satellite, values drive heights; center = the subject chip. */
      layout: 'bars';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Trend line chart — satellites are points left→right, values drive the curve; center = the subject chip. */
      layout: 'chart-line';
      center: PreviewNode;
      satellites: PreviewNode[];
    })
  | (SpecBase & {
      /** Donut / parts-of-whole — satellites are segments, values drive shares; center sits in the hole. */
      layout: 'donut';
      center: PreviewNode;
      satellites: PreviewNode[];
    });

interface PositionedTile {
  key: string;
  icon: ReactNode;
  label?: string;
  x: number;
  y: number;
  size: number;
  center?: boolean;
  flush?: boolean;
}

type EdgeKind = 'curve-h' | 'line' | 'bracket-v' | 'cubic' | 'arc';

interface Edge {
  key: string;
  from: string;
  to: string;
  kind: EdgeKind;
  /** Outward bow factor for 'arc' edges (cycle layout); others ignore it. */
  bow?: number;
}

export interface Dims {
  W: number;
  H: number;
  tileBase: number;
  tileLarge: number;
  margin: number;
  labelSize: number;
}

export const HOME_DIMS: Dims = {
  W: 240,
  H: 320,
  tileBase: 22,
  tileLarge: 32,
  margin: 52,
  labelSize: 0,
};

/** Wide native frame (~7:5) — suits horizontal layouts (hub-lr, pipeline). */
export const WIDE_DIMS: Dims = {
  W: 360,
  H: 248,
  tileBase: 26,
  tileLarge: 38,
  margin: 64,
  labelSize: 0,
};

/** Square native frame — suits radial layouts. */
export const SQUARE_DIMS: Dims = {
  W: 300,
  H: 300,
  tileBase: 26,
  tileLarge: 38,
  margin: 64,
  labelSize: 0,
};

/** Tall native frame (~3:4) — suits tree / portrait radial heroes. */
export const TALL_DIMS: Dims = {
  W: 264,
  H: 360,
  tileBase: 24,
  tileLarge: 34,
  margin: 56,
  labelSize: 0,
};

const CANVAS_DIMS: Dims = {
  W: 960,
  H: 540,
  tileBase: 44,
  tileLarge: 72,
  margin: 130,
  labelSize: 13,
};

function hubLRLayout(
  spec: Extract<PreviewSpec, { layout: 'hub-lr' }>,
  d: Dims
) {
  const tiles: PositionedTile[] = [];
  const edges: Edge[] = [];
  const cx = d.W / 2;
  const cy = d.H / 2;
  const leftX = d.margin + d.tileBase / 2;
  const rightX = d.W - d.margin - d.tileBase / 2;

  const place = (nodes: PreviewNode[], x: number) => {
    const top = d.margin;
    const bottom = d.H - d.margin;
    const gap = (bottom - top) / (nodes.length + 1);
    return nodes.map((n, i) => ({ ...n, x, y: top + gap * (i + 1) }));
  };

  const L = place(spec.left, leftX);
  const R = place(spec.right, rightX);

  for (const n of [...L, ...R]) {
    edges.push({
      key: `e-${n.key}`,
      from: n.key,
      to: spec.center.key,
      kind: 'curve-h',
    });
    tiles.push({
      key: n.key,
      icon: n.icon,
      label: n.label,
      x: n.x,
      y: n.y,
      size: d.tileBase,
      flush: n.flush,
    });
  }
  tiles.push({
    key: spec.center.key,
    icon: spec.center.icon,
    label: spec.center.label,
    x: cx,
    y: cy,
    size: d.tileLarge,
    center: true,
    flush: spec.center.flush,
  });
  return { tiles, edges };
}

function pipelineLayout(
  spec: Extract<PreviewSpec, { layout: 'pipeline' }>,
  d: Dims
) {
  const tiles: PositionedTile[] = [];
  const edges: Edge[] = [];
  const y = d.H / 2;
  const n = spec.nodes.length;
  const usable = d.W - d.margin * 2;
  const gap = usable / Math.max(n - 1, 1);
  const points = spec.nodes.map((node, i) => ({
    ...node,
    x: d.margin + gap * i,
    y,
  }));
  const midIdx = Math.floor((points.length - 1) / 2);
  for (let i = 0; i < points.length - 1; i++) {
    edges.push({
      key: `pipe-${i}`,
      from: points[i].key,
      to: points[i + 1].key,
      kind: 'line',
    });
  }
  points.forEach((p, i) => {
    tiles.push({
      key: p.key,
      icon: p.icon,
      label: p.label,
      x: p.x,
      y: p.y,
      size: i === midIdx ? d.tileLarge : d.tileBase,
      center: i === midIdx,
      flush: p.flush,
    });
  });
  return { tiles, edges };
}

function radialLayout(
  spec: Extract<PreviewSpec, { layout: 'radial' }>,
  d: Dims
) {
  const tiles: PositionedTile[] = [];
  const edges: Edge[] = [];
  const cx = d.W / 2;
  const cy = d.H / 2;
  const rx = d.W * 0.36;
  const ry = d.H * 0.34;
  const n = spec.satellites.length;
  for (let i = 0; i < n; i++) {
    const sat = spec.satellites[i];
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * rx;
    const y = cy + Math.sin(angle) * ry;
    edges.push({
      key: `r-${sat.key}`,
      from: spec.center.key,
      to: sat.key,
      kind: 'cubic',
    });
    tiles.push({
      key: sat.key,
      icon: sat.icon,
      label: sat.label,
      x,
      y,
      size: d.tileBase,
      flush: sat.flush,
    });
  }
  tiles.push({
    key: spec.center.key,
    icon: spec.center.icon,
    label: spec.center.label,
    x: cx,
    y: cy,
    size: d.tileLarge,
    center: true,
    flush: spec.center.flush,
  });
  return { tiles, edges };
}

function treeLayout(spec: Extract<PreviewSpec, { layout: 'tree' }>, d: Dims) {
  const tiles: PositionedTile[] = [];
  const edges: Edge[] = [];
  const root = spec.root;
  const rootX = d.W / 2;
  const rootY = d.margin * 0.6 + d.tileLarge / 2;
  const level1 = root.children || [];
  const l1Y = d.H * 0.52;
  const l1Usable = d.W - d.margin * 0.6 * 2;
  const l1Gap = l1Usable / (level1.length + 1);

  tiles.push({
    key: root.key,
    icon: root.icon,
    label: root.label,
    x: rootX,
    y: rootY,
    size: d.tileLarge,
    center: true,
    flush: root.flush,
  });

  level1.forEach((child, i) => {
    const x = d.margin * 0.6 + l1Gap * (i + 1);
    const y = l1Y;
    edges.push({
      key: `t1-${child.key}`,
      from: root.key,
      to: child.key,
      kind: 'bracket-v',
    });
    tiles.push({
      key: child.key,
      icon: child.icon,
      label: child.label,
      x,
      y,
      size: d.tileBase,
      flush: child.flush,
    });

    const l2 = child.children || [];
    if (l2.length) {
      const l2Y = d.H - d.margin - d.tileBase / 2;
      const l2Gap = d.tileBase + 20;
      const startX = x - ((l2.length - 1) * l2Gap) / 2;
      l2.forEach((gc, j) => {
        const gx = startX + l2Gap * j;
        edges.push({
          key: `t2-${gc.key}`,
          from: child.key,
          to: gc.key,
          kind: 'bracket-v',
        });
        tiles.push({
          key: gc.key,
          icon: gc.icon,
          label: gc.label,
          x: gx,
          y: l2Y,
          size: d.tileBase * 0.9,
          flush: gc.flush,
        });
      });
    }
  });
  return { tiles, edges };
}

// ── orbit layout ─────────────────────────────────────────────────────────────
// Napkin/MagicUI-style orbiting circles: the center stays an HTML tile, but the
// satellites live INSIDE the <svg> on 1–2 concentric rings, revolving via SMIL
// <animateTransform>. That keeps the motion in the layer the export pipeline
// re-rasterizes per frame, so GIF/MP4 exports orbit exactly like the live view.

export interface OrbitRing {
  r: number;
  /** Seconds per revolution before speed scaling. */
  period: number;
  dir: 1 | -1;
  /** Tile size on this ring. */
  size: number;
  sats: PreviewNode[];
}

export interface OrbitGeometry {
  cx: number;
  cy: number;
  rings: OrbitRing[];
}

export function computeOrbit(
  spec: Extract<PreviewSpec, { layout: 'orbit' }>,
  d: Dims
): OrbitGeometry {
  const cx = d.W / 2;
  const cy = d.H / 2;
  // Leave room for the tile itself plus its label below the lowest satellite.
  const outerR = Math.min(d.W, d.H) / 2 - d.margin * 0.7;
  const sats = spec.satellites;
  if (sats.length <= 4) {
    return {
      cx,
      cy,
      rings: [{ r: outerR, period: 26, dir: 1, size: d.tileBase, sats }],
    };
  }
  const innerCount = Math.min(3, Math.max(2, Math.floor(sats.length * 0.4)));
  return {
    cx,
    cy,
    rings: [
      {
        r: outerR * 0.52,
        period: 17,
        dir: -1,
        size: d.tileBase * 0.9,
        sats: sats.slice(0, innerCount),
      },
      {
        r: outerR,
        period: 30,
        dir: 1,
        size: d.tileBase,
        sats: sats.slice(innerCount),
      },
    ],
  };
}

/** Start angle (deg) of satellite `i` on its ring — 12 o'clock, evenly spread. */
const orbitStartAngle = (ring: OrbitRing, i: number) =>
  -90 + (360 / Math.max(ring.sats.length, 1)) * i;

/**
 * Where a satellite is at SMIL time `t` — mirrors the <animateTransform>
 * timing exactly (linear, begin 0, dur = period / speed) so pointer hit-testing
 * can find a moving tile.
 */
function orbitSatPosition(
  geo: OrbitGeometry,
  ring: OrbitRing,
  i: number,
  t: number,
  speed: number
) {
  const dur = ring.period / Math.max(speed, 0.05);
  const a0 = orbitStartAngle(ring, i);
  const a = ((a0 + ring.dir * 360 * ((t % dur) / dur)) * Math.PI) / 180;
  return { x: geo.cx + Math.cos(a) * ring.r, y: geo.cy + Math.sin(a) * ring.r };
}

function orbitLayout(spec: Extract<PreviewSpec, { layout: 'orbit' }>, d: Dims) {
  // Only the center is a positioned HTML tile; satellites render in the SVG.
  const tiles: PositionedTile[] = [
    {
      key: spec.center.key,
      icon: spec.center.icon,
      label: spec.center.label,
      x: d.W / 2,
      y: d.H / 2,
      size: d.tileLarge,
      center: true,
      flush: spec.center.flush,
    },
  ];
  return { tiles, edges: [] as Edge[] };
}

// ── shape layouts (Napkin-style structural variants) ─────────────────────────
// Shared conventions: every node is a static HTML PositionedTile (labels,
// selection, drag and icon rendering come free); decorative shape chrome and
// mode motion live in the SVG layer with presentation attributes only, so the
// serialized export SVG renders identically. Chrome geometry functions are
// pure in (spec, Dims) and get called from both computeLayout and the chrome
// render block.

/** Tile chrome padding the Tile component adds around the icon per variant. */
const tilePad = (d: Dims) => (d.labelSize > 0 ? 22 : 16);
/** Vertical room reserved under a tile for its HTML label (canvas only). */
const labelRoom = (d: Dims) => (d.labelSize > 0 ? d.labelSize + 16 : 3);

// ---- cycle ------------------------------------------------------------------
function cycleLayout(spec: Extract<PreviewSpec, { layout: 'cycle' }>, d: Dims) {
  const tiles: PositionedTile[] = [];
  const edges: Edge[] = [];
  const cx = d.W / 2;
  const cy = d.H / 2;
  const rx = d.W * 0.34;
  const ry = d.H * 0.32;
  const sats = spec.satellites.slice(0, 8);
  const n = Math.max(sats.length, 1);
  // Exact circum-ellipse sagitta so the N arcs fuse into one continuous ring.
  const bow = Math.tan(Math.PI / (2 * n));
  const pts = sats.map((s, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { ...s, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
  });
  pts.forEach((p, i) => {
    edges.push({
      key: `cyc-${i}`,
      from: p.key,
      to: pts[(i + 1) % n].key,
      kind: 'arc',
      bow,
    });
    tiles.push({
      key: p.key,
      icon: p.icon,
      label: p.label,
      x: p.x,
      y: p.y,
      size: d.tileBase,
      flush: p.flush,
    });
  });
  tiles.push({
    key: spec.center.key,
    icon: spec.center.icon,
    label: spec.center.label,
    x: cx,
    y: cy,
    size: d.tileLarge,
    center: true,
    flush: spec.center.flush,
  });
  return { tiles, edges };
}

// ---- steps -------------------------------------------------------------------
interface StepsGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  fillD: string;
  profileD: string;
  shadows: Array<{ cx: number; cy: number; rx: number; ry: number }>;
  flag: { x: number; top: number; poleH: number } | null;
  landingY: number;
}
function stepsGeo(
  spec: Extract<PreviewSpec, { layout: 'steps' }>,
  d: Dims
): StepsGeo {
  const sats = spec.satellites.slice(0, 8);
  const N = Math.max(sats.length, 1);
  const padEst = tilePad(d);
  const lr = labelRoom(d);
  const mX = d.margin * 0.5;
  const x0 = mX;
  const usableW = d.W - 2 * mX;
  const yBase = d.H - d.margin * 0.42;
  const goalVis = d.tileLarge + padEst;
  const landingY = d.margin * 0.4 + goalVis + lr;
  const rise = (yBase - landingY) / (N + 1);
  const t1 = usableW / (N + 1.35);
  const landingW = 1.35 * t1 >= goalVis + 8 ? 1.35 * t1 : goalVis + 8;
  const treadW = (usableW - landingW) / N;
  const xEnd = x0 + N * treadW + landingW;
  const treadY = (k: number) => landingY + (N + 1 - k) * rise;
  const satVisMax = Math.max(treadW, rise) - 2;
  const satSize = Math.max(
    Math.min(d.tileBase, satVisMax - padEst),
    d.tileBase * 0.55
  );
  const satVis = satSize + padEst;

  const tiles: PositionedTile[] = [];
  const edges: Edge[] = [];
  const shadows: StepsGeo['shadows'] = [];
  sats.forEach((s, i) => {
    const k = i + 1;
    const x = x0 + (k - 0.5) * treadW;
    const y = treadY(k) - lr - satVis / 2 - 2;
    tiles.push({
      key: s.key,
      icon: s.icon,
      label: s.label,
      x,
      y,
      size: satSize,
      flush: s.flush,
    });
    shadows.push({
      cx: x,
      cy: treadY(k) - 1.5,
      rx: satVis * 0.3,
      ry: d.labelSize > 0 ? 2.6 : 1.8,
    });
    if (i < N - 1) {
      edges.push({
        key: `s-${i}`,
        from: s.key,
        to: sats[i + 1].key,
        kind: 'curve-h',
      });
    }
  });
  const goalX = x0 + N * treadW + landingW / 2;
  tiles.push({
    key: spec.center.key,
    icon: spec.center.icon,
    label: spec.center.label,
    x: goalX,
    y: landingY - lr - goalVis / 2 - 2,
    size: d.tileLarge,
    center: true,
    flush: spec.center.flush,
  });
  shadows.push({
    cx: goalX,
    cy: landingY - 1.5,
    rx: goalVis * 0.3,
    ry: d.labelSize > 0 ? 2.6 : 1.8,
  });
  if (N > 0) {
    edges.push({
      key: 's-goal',
      from: sats[N - 1].key,
      to: spec.center.key,
      kind: 'curve-h',
    });
  }

  let profileD = `M ${x0} ${yBase}`;
  for (let k = 1; k <= N; k++) {
    profileD += ` L ${x0 + (k - 1) * treadW} ${treadY(k)} L ${x0 + k * treadW} ${treadY(k)}`;
  }
  profileD += ` L ${x0 + N * treadW} ${landingY} L ${xEnd} ${landingY}`;
  const fillD = `${profileD} L ${xEnd} ${yBase} Z`;

  const poleH = Math.min(30, Math.max(14, rise * 0.85));
  const flagX = xEnd - Math.max(12, landingW * 0.14);
  const flag =
    rise >= 15 && flagX >= goalX + goalVis / 2 + 8
      ? { x: flagX, top: landingY - poleH, poleH }
      : null;

  return { tiles, edges, fillD, profileD, shadows, flag, landingY };
}

// ---- funnel ------------------------------------------------------------------
interface FunnelGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  bands: Array<{
    points: string;
    fillOp: number;
    leader: string;
  }>;
  wallL: string;
  wallR: string;
  spoutDrop: string;
  cx: number;
  funnelTop: number;
  spoutY: number;
  outcomeY: number;
}
function funnelGeo(
  spec: Extract<PreviewSpec, { layout: 'funnel' }>,
  d: Dims
): FunnelGeo {
  const sats = spec.satellites.slice(0, 8);
  const L = Math.max(sats.length, 1);
  const cx = d.W / 2;
  const padEst = tilePad(d);
  const lr = labelRoom(d);
  const funnelTop = d.margin * 0.5;
  const outVis = d.tileLarge + padEst;
  const spoutY = d.H - d.margin * 0.4 - outVis - lr - 10;
  const range = spoutY - funnelTop;
  const bandH = range / L;
  const gap = Math.max(1.5, range * 0.012);
  const halfTop = Math.min(d.W * 0.3, range * 0.75);
  const halfBot = halfTop * 0.3;
  const hw = (y: number) =>
    halfTop + ((halfBot - halfTop) * (y - funnelTop)) / range;
  const sizeF = L >= 7 ? 0.8 : L === 6 ? 0.9 : 1;
  const satSize = d.tileBase * sizeF;

  const tiles: PositionedTile[] = [];
  const bands: FunnelGeo['bands'] = [];
  sats.forEach((s, j) => {
    const yTop = funnelTop + bandH * j + (j === 0 ? 0 : gap / 2);
    const yBot = funnelTop + bandH * (j + 1) - (j === L - 1 ? 0 : gap / 2);
    const yMid = funnelTop + bandH * (j + 0.5);
    const side = j % 2 === 0 ? 1 : -1;
    const lsx = cx + side * hw(yMid);
    const lex = lsx + side * d.tileBase * 0.7;
    bands.push({
      points: `${cx - hw(yTop)},${yTop} ${cx + hw(yTop)},${yTop} ${cx + hw(yBot)},${yBot} ${cx - hw(yBot)},${yBot}`,
      fillOp: 0.1 + 0.16 * (L === 1 ? 1 : j / (L - 1)),
      leader: `M ${lsx} ${yMid} L ${lex} ${yMid}`,
    });
    tiles.push({
      key: s.key,
      icon: s.icon,
      label: s.label,
      x: lex + side * satSize * 0.75,
      y: yMid,
      size: satSize,
      flush: s.flush,
    });
  });
  const outcomeY = spoutY + 10 + outVis / 2;
  tiles.push({
    key: spec.center.key,
    icon: spec.center.icon,
    label: spec.center.label,
    x: cx,
    y: outcomeY,
    size: d.tileLarge,
    center: true,
    flush: spec.center.flush,
  });
  return {
    tiles,
    edges: [],
    bands,
    wallL: `M ${cx - halfTop} ${funnelTop} L ${cx - halfBot} ${spoutY}`,
    wallR: `M ${cx + halfTop} ${funnelTop} L ${cx + halfBot} ${spoutY}`,
    spoutDrop: `M ${cx} ${spoutY} L ${cx} ${spoutY + 10}`,
    cx,
    funnelTop,
    spoutY,
    outcomeY,
  };
}

// ---- pyramid -----------------------------------------------------------------
interface PyramidGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  bands: Array<{ points: string; fillOp: number; leader: string }>;
  slopeL: string;
  slopeR: string;
  baseLine: string;
  cx: number;
  topY: number;
}
function pyramidGeo(
  spec: Extract<PreviewSpec, { layout: 'pyramid' }>,
  d: Dims
): PyramidGeo {
  const sats = spec.satellites.slice(0, 8);
  const L = Math.max(sats.length, 1);
  const big = L >= 7;
  const cx = d.W / 2;
  const topY = d.margin * (big ? 0.42 : 0.52) + d.tileLarge * 0.22;
  const labelReserve = d.labelSize > 0 ? d.labelSize + 14 : 4;
  const bandTop = topY + d.tileLarge * 0.78 + labelReserve;
  const baseY = d.H - d.margin * (big ? 0.35 : 0.55);
  const range = baseY - bandTop;
  const baseHalf = Math.min(d.W * 0.28, range * 0.85);
  const hw = (y: number) => (baseHalf * (y - topY)) / (baseY - topY);
  const bandH = range / L;
  const gap = Math.max(1.5, range * 0.012);
  const sizeF = L >= 7 ? 0.8 : L === 6 ? 0.9 : 1;
  const satSize = d.tileBase * sizeF;

  const tiles: PositionedTile[] = [
    {
      key: spec.center.key,
      icon: spec.center.icon,
      label: spec.center.label,
      x: cx,
      y: topY,
      size: d.tileLarge,
      center: true,
      flush: spec.center.flush,
    },
  ];
  const bands: PyramidGeo['bands'] = [];
  // band j = 0..L-1 top→bottom; its satellite is satellites[L-1-j] (base-first)
  for (let j = 0; j < L; j++) {
    const si = L - 1 - j;
    const s = sats[si];
    const yTop = bandTop + bandH * j + (j === 0 ? 0 : gap / 2);
    const yBot = bandTop + bandH * (j + 1) - (j === L - 1 ? 0 : gap / 2);
    const yMid = bandTop + bandH * (j + 0.5);
    const side = si % 2 === 0 ? 1 : -1; // bottom band anchors RIGHT
    const lsx = cx + side * hw(yMid);
    const lex = lsx + side * d.tileBase * 0.7;
    bands.push({
      points: `${cx - hw(yTop)},${yTop} ${cx + hw(yTop)},${yTop} ${cx + hw(yBot)},${yBot} ${cx - hw(yBot)},${yBot}`,
      fillOp: 0.1 + 0.16 * (L === 1 ? 1 : j / (L - 1)),
      leader: `M ${lsx} ${yMid} L ${lex} ${yMid}`,
    });
    tiles.push({
      key: s.key,
      icon: s.icon,
      label: s.label,
      x: lex + side * satSize * 0.75,
      y: yMid,
      size: satSize,
      flush: s.flush,
    });
  }
  return {
    tiles,
    edges: [],
    bands,
    slopeL: `M ${cx - baseHalf} ${baseY} L ${cx} ${topY}`,
    slopeR: `M ${cx + baseHalf} ${baseY} L ${cx} ${topY}`,
    baseLine: `M ${cx - baseHalf} ${baseY} L ${cx + baseHalf} ${baseY}`,
    cx,
    topY,
  };
}

// ---- quadrant ------------------------------------------------------------------
const CELL_TINTS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
interface QuadrantGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  cells: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    cx: number;
    cy: number;
    tint: string;
    ghost: boolean;
  }>;
  cx: number;
  cy: number;
  hPath: string;
  vPath: string;
  half: string[];
  A: number;
  hasCenter: boolean;
  /** Numeric axis extents for userSpaceOnUse gradients + arrowhead tips. */
  axis: { hx0: number; hx1: number; vy0: number; vy1: number };
}
function quadrantGeo(
  spec: Extract<PreviewSpec, { layout: 'quadrant' }>,
  d: Dims
): QuadrantGeo {
  const sats = spec.satellites.slice(0, 8);
  const N = sats.length;
  const ix = d.margin * 0.5;
  const iy = d.margin * 0.5;
  const QW = Math.min(d.W - 2 * ix, (d.H - 2 * iy) * 1.9);
  const QH = Math.min(d.H - 2 * iy, (d.W - 2 * ix) * 1.3);
  const qx = (d.W - QW) / 2;
  const qy = (d.H - QH) / 2;
  const cx = d.W / 2;
  const cy = d.H / 2;
  const G = Math.max(8, d.tileBase * 0.45);
  const cellW = (QW - G) / 2;
  const cellH = (QH - G) / 2;
  const ov = G * 0.7;
  const A = Math.max(5, G * 0.55);
  const labelHalf = d.labelSize > 0 ? (d.labelSize + 8) / 2 : 0;
  const dropSecondaries = Math.min(cellW, cellH) < d.tileBase * 2.8;

  const cells: QuadrantGeo['cells'] = [0, 1, 2, 3].map((i) => {
    const x = qx + (i % 2) * (cellW + G);
    const y = qy + Math.floor(i / 2) * (cellH + G);
    return {
      x,
      y,
      w: cellW,
      h: cellH,
      cx: x + cellW / 2,
      cy: y + cellH / 2,
      // Fixed SWOT-style tints — satellite hash-tints are arbitrary and make
      // the matrix read as random washes instead of four deliberate zones.
      tint: CELL_TINTS[i],
      ghost: N === 3 && i === 3,
    };
  });

  const tiles: PositionedTile[] = [];
  const shared = (i: number) => N > 4 && i < N - 4 && !dropSecondaries;
  sats.slice(0, 4).forEach((s, i) => {
    const c = cells[i];
    tiles.push({
      key: s.key,
      icon: s.icon,
      label: s.label,
      x: shared(i) ? c.cx - cellW * 0.17 : c.cx,
      y: shared(i) ? c.cy - cellH * 0.18 - labelHalf * 0.6 : c.cy - labelHalf,
      size: d.tileBase,
      flush: s.flush,
    });
  });
  if (!dropSecondaries) {
    sats.slice(4).forEach((s, k) => {
      const c = cells[k];
      tiles.push({
        key: s.key,
        icon: s.icon,
        label: s.label,
        x: c.cx + cellW * 0.19,
        y: c.cy + cellH * 0.16 - labelHalf * 0.6,
        size: d.tileBase * 0.78,
        flush: s.flush,
      });
    });
  }
  if (spec.center) {
    tiles.push({
      key: spec.center.key,
      icon: spec.center.icon,
      label: spec.center.label,
      x: cx,
      y: cy,
      size: d.tileLarge,
      center: true,
      flush: spec.center.flush,
    });
  }
  return {
    tiles,
    edges: [],
    cells,
    cx,
    cy,
    hPath: `M ${qx - ov} ${cy} L ${qx + QW + ov} ${cy}`,
    vPath: `M ${cx} ${qy - ov} L ${cx} ${qy + QH + ov}`,
    half: [
      `M ${cx} ${cy} L ${qx + QW + ov} ${cy}`,
      `M ${cx} ${cy} L ${cx} ${qy + QH + ov}`,
      `M ${cx} ${cy} L ${qx - ov} ${cy}`,
      `M ${cx} ${cy} L ${cx} ${qy - ov}`,
    ],
    A,
    hasCenter: !!spec.center,
    axis: { hx0: qx - ov, hx1: qx + QW + ov, vy0: qy - ov, vy1: qy + QH + ov },
  };
}

// ---- columns -------------------------------------------------------------------
interface ColumnsGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  panels: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    cx: number;
    tint: string;
    spine: string;
  }>;
  rx: number;
  divTop: string;
  divBottom: string;
  toCenterL: string;
  toCenterR: string;
  cx: number;
  cy: number;
  hasCenter: boolean;
}
function columnsGeo(
  spec: Extract<PreviewSpec, { layout: 'columns' }>,
  d: Dims
): ColumnsGeo {
  const sats = spec.satellites.slice(0, 8);
  const N = sats.length;
  const ix = d.margin * 0.5;
  const iy = d.margin * 0.5;
  const padEst = tilePad(d);
  const G = Math.max(d.tileLarge + padEst + 16, d.W * 0.14);
  const colW = (d.W - 2 * ix - G) / 2;
  const colH = d.H - 2 * iy;
  const cx = d.W / 2;
  const cy = d.H / 2;
  const labelHalf = d.labelSize > 0 ? (d.labelSize + 8) / 2 : 0;
  const mid = Math.ceil(N / 2);
  const groups = [sats.slice(0, mid), sats.slice(mid)];
  const rx = Math.max(6, d.tileBase * 0.3);

  const panels: ColumnsGeo['panels'] = [0, 1].map((p) => {
    const x = p === 0 ? ix : ix + colW + G;
    return {
      x,
      y: iy,
      w: colW,
      h: colH,
      cx: x + colW / 2,
      tint: p === 0 ? '#10b981' : '#ef4444',
      spine: `M ${x + colW / 2} ${iy + 16} L ${x + colW / 2} ${iy + colH - 16}`,
    };
  });

  const tiles: PositionedTile[] = [];
  groups.forEach((group, p) => {
    const rowGap = colH / (group.length + 1);
    group.forEach((s, k) => {
      tiles.push({
        key: s.key,
        icon: s.icon,
        label: s.label,
        x: panels[p].cx,
        y: iy + rowGap * (k + 1) - labelHalf,
        size: d.tileBase,
        flush: s.flush,
      });
    });
  });
  if (spec.center) {
    tiles.push({
      key: spec.center.key,
      icon: spec.center.icon,
      label: spec.center.label,
      x: cx,
      y: cy,
      size: d.tileLarge,
      center: true,
      flush: spec.center.flush,
    });
  }
  const cVis = (d.tileLarge + padEst) * 0.75;
  return {
    tiles,
    edges: [],
    panels,
    rx,
    divTop: `M ${cx} ${iy + 6} L ${cx} ${cy - cVis}`,
    divBottom: `M ${cx} ${cy + cVis + labelHalf * 2} L ${cx} ${iy + colH - 6}`,
    toCenterL: `M ${ix + colW + 4} ${cy} L ${cx} ${cy}`,
    toCenterR: `M ${ix + colW + G - 4} ${cy} L ${cx} ${cy}`,
    cx,
    cy,
    hasCenter: !!spec.center,
  };
}

// ---- timeline ------------------------------------------------------------------
interface TimelineGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  lineY: number;
  linePath: string;
  lineEndX: number;
  dots: Array<{ x: number; stem: string }>;
}
function timelineGeo(
  spec: Extract<PreviewSpec, { layout: 'timeline' }>,
  d: Dims
): TimelineGeo {
  const sats = spec.satellites.slice(0, 8);
  const N = Math.max(sats.length, 1);
  const padEst = tilePad(d);
  const unit = d.tileBase + padEst;
  const labelSpace = d.labelSize > 0 ? d.labelSize + 10 : 4;
  const lineY = d.H * 0.5;
  const x0 = d.margin * 0.55;
  const xEnd = d.W - d.margin * 0.55;
  const startX = x0 + d.tileLarge + 12;
  const gap = (xEnd - startX - 10) / N;

  const tiles: PositionedTile[] = [];
  const dots: TimelineGeo['dots'] = [];
  sats.forEach((s, i) => {
    const x = startX + gap * (i + 0.5);
    const above = i % 2 === 0;
    // Above the line the stack is [tile][label][8px][line]; below it is
    // [line][10px][tile][label] — labels always render under their tile.
    const y = above ? lineY - 8 - labelSpace - unit / 2 : lineY + 10 + unit / 2;
    dots.push({
      x,
      stem: above
        ? `M ${x} ${lineY} L ${x} ${lineY - 8}`
        : `M ${x} ${lineY} L ${x} ${lineY + 10}`,
    });
    tiles.push({
      key: s.key,
      icon: s.icon,
      label: s.label,
      x,
      y,
      size: d.tileBase,
      flush: s.flush,
    });
  });
  tiles.push({
    key: spec.center.key,
    icon: spec.center.icon,
    label: spec.center.label,
    x: x0 + d.tileLarge * 0.5,
    y: lineY,
    size: d.tileLarge,
    center: true,
    flush: spec.center.flush,
  });
  return {
    tiles,
    edges: [],
    lineY,
    linePath: `M ${x0} ${lineY} L ${xEnd} ${lineY}`,
    lineEndX: xEnd,
    dots,
  };
}

// ---- iceberg -------------------------------------------------------------------
interface IcebergGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  waterY: number;
  wavePath: string;
  aboveBerg: string;
  belowBerg: string;
  bubbleRails: string[];
}
function icebergGeo(
  spec: Extract<PreviewSpec, { layout: 'iceberg' }>,
  d: Dims
): IcebergGeo {
  const sats = spec.satellites.slice(0, 8);
  const N = sats.length;
  const cx = d.W / 2;
  const padEst = tilePad(d);
  const unit = d.tileBase + padEst;
  const labelSpace = d.labelSize > 0 ? d.labelSize + 10 : 4;
  const waterY = d.H * 0.42;
  const aH = (waterY - d.margin * 0.4) * 0.92;
  const bH = d.H - waterY - d.margin * 0.45;

  const aboveCount = N >= 5 ? 2 : N >= 3 ? 1 : 0;
  const above = sats.slice(0, aboveCount);
  const below = sats.slice(aboveCount);

  const tiles: PositionedTile[] = [
    {
      key: spec.center.key,
      icon: spec.center.icon,
      label: spec.center.label,
      x: cx,
      y: waterY - aH + (d.tileLarge + padEst) * 0.3,
      size: d.tileLarge,
      center: true,
      flush: spec.center.flush,
    },
  ];
  above.forEach((s, i) => {
    const side = i === 0 ? -1 : 1;
    tiles.push({
      key: s.key,
      icon: s.icon,
      label: s.label,
      x: cx + side * d.W * 0.26,
      y: waterY - unit * 0.62 - labelSpace,
      size: d.tileBase,
      flush: s.flush,
    });
  });
  const row1 = below.slice(0, Math.ceil(below.length / 2));
  const row2 = below.slice(Math.ceil(below.length / 2));
  const placeRow = (row: PreviewNode[], y: number, spread: number) => {
    row.forEach((s, k) => {
      const t = row.length === 1 ? 0.5 : k / (row.length - 1);
      tiles.push({
        key: s.key,
        icon: s.icon,
        label: s.label,
        x: cx - spread + t * spread * 2,
        y,
        size: d.tileBase,
        flush: s.flush,
      });
    });
  };
  placeRow(row1, waterY + bH * 0.34, d.W * (row1.length > 2 ? 0.3 : 0.19));
  placeRow(row2, waterY + bH * 0.74, d.W * (row2.length > 2 ? 0.24 : 0.14));

  const wx0 = d.margin * 0.3;
  const wx1 = d.W - d.margin * 0.3;
  const seg = (wx1 - wx0) / 6;
  const amp = Math.max(3, d.H * 0.008);
  let wavePath = `M ${wx0} ${waterY}`;
  for (let i = 0; i < 3; i++) {
    wavePath += ` q ${seg} ${-amp} ${seg * 2} 0`;
  }
  const bw = d.W * 0.16;
  const aboveBerg = `${cx - bw},${waterY} ${cx - d.W * 0.05},${waterY - aH * 0.55} ${cx},${waterY - aH} ${cx + d.W * 0.07},${waterY - aH * 0.5} ${cx + bw},${waterY}`;
  const belowBerg = `${cx - bw},${waterY} ${cx - d.W * 0.3},${waterY + bH * 0.42} ${cx - d.W * 0.16},${waterY + bH * 0.82} ${cx},${waterY + bH * 0.96} ${cx + d.W * 0.22},${waterY + bH * 0.72} ${cx + d.W * 0.31},${waterY + bH * 0.34} ${cx + bw},${waterY}`;
  const bubbleRails = [-0.34, 0, 0.35].map(
    (f) =>
      `M ${cx + f * d.W} ${waterY + bH * 0.9} L ${cx + f * d.W * 0.8} ${waterY + 4}`
  );
  return {
    tiles,
    edges: [],
    waterY,
    wavePath,
    aboveBerg,
    belowBerg,
    bubbleRails,
  };
}

// ---- iso-steps (isometric cube staircase) -------------------------------------
// Faithful to the "numbered cubes" infographic style: a staircase of isometric
// cubes (front face carries the satellite label — usually 01…NN), crowned by a
// white cube bearing the center's logo. A lift-and-flash wave travels up the
// numbering order on a shared SMIL clock (one `dur`, begin 0) so the export
// pipeline sees a clean seekable period and GIF/MP4 loop seamlessly, while the
// structure itself stays static — PNG exports and thumbnails always read.

interface IsoCube {
  key: string;
  /** wave order = the numbering order (row-major, bottom row first) */
  k: number;
  /** front-bottom-left anchor vertex in svg coords */
  x: number;
  y: number;
  label?: string;
}

interface IsoGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  /** cube edge length (screen px in the svg viewBox) */
  s: number;
  /** face outline width */
  sw: number;
  /** cubes in painter order (back column → front column, bottom → top) */
  cubes: IsoCube[];
  /** anchor of the white logo cube (crowns the tallest column) */
  logo: { x: number; y: number };
  /** svg-x where the heading zone begins, or null when no heading is shown */
  headingLeft: number | null;
  /** shared SMIL loop period (seconds, before speed scaling) */
  period: number;
  /** seconds between successive cube pulses */
  gap: number;
  /** quiet lead-in before the wave starts */
  lead: number;
  /** pulse lift height (px) */
  lift: number;
}

/** amt > 0 tints toward white, amt < 0 shades toward black. */
function isoShade(hex: string, amt: number): string {
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
  const p = Math.abs(amt);
  const ch = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v + (t - v) * p)));
  return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

function isoGeo(
  spec: Extract<PreviewSpec, { layout: 'iso-steps' }>,
  d: Dims
): IsoGeo {
  const sats = spec.satellites.slice(0, 15);
  const N = Math.max(sats.length, 1);
  // Smallest staircase base whose shrinking rows (C, C-1, …) hold N cubes.
  const C = Math.max(2, Math.ceil((Math.sqrt(8 * N + 1) - 1) / 2));

  // Fill row-major bottom-up — the numbering order of the reference visual.
  const cells: Array<{ c: number; h: number; sat: PreviewNode; k: number }> =
    [];
  let k = 0;
  for (let h = 0; k < N; h++) {
    const rowW = Math.max(1, C - h);
    for (let c = 0; c < rowW && k < N; c++) {
      cells.push({ c, h, sat: sats[k], k });
      k++;
    }
  }
  const col0H = cells.filter((cell) => cell.c === 0).length;
  const Htot = col0H + 1; // + the logo cube

  // Iso axes: column u = right-down, depth = right-up, stack = straight up.
  // Scene bbox in cube-edge units: width (C+1)·0.866, height Htot+0.5 (top
  // face far corner) + C·0.5 (the last column's descent).
  const headed = d.labelSize > 0 && !!spec.center.label;
  const unitsW = (C + 1) * 0.866;
  const unitsH = Htot + 0.5 + C * 0.5;
  const zoneW = d.W * (headed ? 0.56 : 0.92);
  const zoneX = d.W * 0.04;
  const s = Math.min(zoneW / unitsW, (d.H * 0.88) / unitsH);
  const sceneW = unitsW * s;
  const sceneH = unitsH * s;
  const x0 = headed ? zoneX + (zoneW - sceneW) / 2 : (d.W - sceneW) / 2;
  const anchorY0 = (d.H - sceneH) / 2 + (Htot + 0.5) * s;

  const cubes: IsoCube[] = [...cells]
    .sort((a, b) => a.c - b.c || a.h - b.h) // painter order
    .map((cell) => ({
      key: cell.sat.key,
      k: cell.k,
      x: x0 + cell.c * 0.866 * s,
      y: anchorY0 + cell.c * 0.5 * s - cell.h * s,
      label: cell.sat.label,
    }));

  const gap = 0.22;
  const lead = 0.5;
  return {
    tiles: [],
    edges: [],
    s,
    sw: Math.max(1.4, s * 0.055),
    cubes,
    logo: { x: x0, y: anchorY0 - col0H * s },
    headingLeft: headed ? zoneX + zoneW + d.W * 0.02 : null,
    period: lead + (N - 1) * gap + 0.55 + 1.5,
    gap,
    lead,
    lift: s * 0.16,
  };
}

// ---- chart layouts (bars / chart-line / donut) ---------------------------------
//
// The base chrome is STATIC (full bars, drawn curve, complete ring) — like the
// pyramid bands or column panels — so PNG/thumbnail captures are always
// readable and the SMIL accents loop seamlessly for GIF/MP4 export. All motion
// lives in the mode accents (pulses / dots / beams / arrows).

/** Font stack for SVG value text — inline so standalone rasterization keeps it. */
const CHART_FONT = 'ui-sans-serif, system-ui, -apple-system, sans-serif';

/** Structural ink used by the shape chrome throughout this file. */
const CHART_INK = 'rgba(15,42,62,0.6)';

/** Ordered categorical palette; `accent` leads, near-duplicates are skipped. */
function chartPalette(accent: string): string[] {
  const fixed = [
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#0ea5e9',
    '#ef4444',
    '#14b8a6',
  ];
  const acc = accent.toLowerCase();
  return [accent, ...fixed.filter((c) => c !== acc)];
}

/** First numeric token in a label ("$1.2M ARR" → 1.2, "45%" → 45), else null. */
function valueFromLabel(label?: string): number | null {
  const m = (label || '').match(/-?\d+(?:[.,]\d+)?/);
  if (!m) return null;
  const n = Number.parseFloat(m[0].replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** Pleasing fallback series so charts render well before values are edited in. */
const SYNTH_SERIES: Record<'bars' | 'chart-line' | 'donut', number[]> = {
  bars: [62, 84, 45, 95, 58, 76, 50, 88],
  'chart-line': [18, 30, 26, 44, 58, 52, 74, 92],
  donut: [38, 26, 18, 11, 7, 5, 4, 3],
};

/** Resolve the numeric series for a chart's satellites (value → label → synth). */
function chartSeries(
  sats: PreviewNode[],
  kind: 'bars' | 'chart-line' | 'donut'
): number[] {
  return sats.map((s, i) => {
    if (typeof s.value === 'number' && Number.isFinite(s.value) && s.value >= 0)
      return s.value;
    const parsed = valueFromLabel(s.label);
    if (parsed !== null && parsed > 0) return parsed;
    return SYNTH_SERIES[kind][i % SYNTH_SERIES[kind].length];
  });
}

/** "1200000" → "1.2M", "45.0" → "45"; prepends/appends the node's unit. */
function fmtChartValue(v: number, unit?: string): string {
  const abs = Math.abs(v);
  let num: string;
  if (abs >= 1_000_000)
    num = `${(v / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1).replace(/\.0$/, '')}M`;
  else if (abs >= 10_000)
    num = `${(v / 1000).toFixed(abs >= 100_000 ? 0 : 1).replace(/\.0$/, '')}k`;
  else num = Number.isInteger(v) ? `${v}` : v.toFixed(1);
  if (!unit) return num;
  return /^[$€£]$/.test(unit) ? `${unit}${num}` : `${num}${unit}`;
}

/** Shared plot frame: tiles row along the bottom, subject chip top-left. */
function chartFrame(d: Dims) {
  const padEst = tilePad(d);
  const labelSpace = d.labelSize > 0 ? d.labelSize + 10 : 4;
  const tileRow = d.tileBase + padEst;
  const ix = d.margin * 0.55;
  const top = d.margin * 0.45;
  const tileY = d.H - d.margin * 0.28 - labelSpace - tileRow / 2;
  const baseY = tileY - tileRow / 2 - 10;
  const valSize = Math.max(9, d.labelSize + 1);
  const plotTop = top + d.tileLarge + valSize + 16;
  return {
    ix,
    top,
    tileY,
    baseY,
    valSize,
    plotTop,
    plotL: ix,
    plotR: d.W - ix,
  };
}

interface ChartValueLabel {
  x: number;
  y: number;
  text: string;
}

interface BarsGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  bars: Array<{ x: number; y: number; w: number; h: number; color: string }>;
  rx: number;
  baseline: string;
  gridYs: number[];
  plotL: number;
  plotR: number;
  baseY: number;
  valueLabels: ChartValueLabel[];
  valSize: number;
  /** Per-bar vertical spine (base → top) for beam/dot accents. */
  spines: string[];
  /** Polyline over the bar tops for the arrows accent. */
  topPath: string;
}

function barsGeo(
  spec: Extract<PreviewSpec, { layout: 'bars' }>,
  d: Dims
): BarsGeo {
  const sats = spec.satellites.slice(0, 8);
  const N = Math.max(sats.length, 1);
  const f = chartFrame(d);
  const values = chartSeries(sats, 'bars');
  const vmax = Math.max(...values, 1);
  const palette = chartPalette(spec.accent || '#ff5b8a');
  const range = f.baseY - f.plotTop;
  const step = (f.plotR - f.plotL) / N;
  const barW = Math.min(step * 0.56, d.tileLarge * 1.3);

  const tiles: PositionedTile[] = [
    {
      key: spec.center.key,
      icon: spec.center.icon,
      label: spec.center.label,
      x: f.ix + d.tileLarge * 0.5,
      y: f.top + d.tileLarge * 0.5,
      size: d.tileLarge,
      center: true,
      flush: spec.center.flush,
    },
  ];
  const bars: BarsGeo['bars'] = [];
  const valueLabels: ChartValueLabel[] = [];
  const spines: string[] = [];
  const tops: Array<{ x: number; y: number }> = [];
  sats.forEach((s, i) => {
    const x = f.plotL + step * (i + 0.5);
    const h = Math.max(range * 0.08, (values[i] / vmax) * range);
    const y = f.baseY - h;
    bars.push({
      x: x - barW / 2,
      y,
      w: barW,
      h,
      color: palette[i % palette.length],
    });
    valueLabels.push({
      x,
      y: y - f.valSize * 0.55,
      text: fmtChartValue(values[i], s.unit),
    });
    spines.push(`M ${x} ${f.baseY} L ${x} ${y}`);
    tops.push({ x, y: y - f.valSize * 1.6 });
    tiles.push({
      key: s.key,
      icon: s.icon,
      label: s.label,
      x,
      y: f.tileY,
      size: d.tileBase,
      flush: s.flush,
    });
  });
  const topPath = tops
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
  return {
    tiles,
    edges: [],
    bars,
    rx: Math.max(3, barW * 0.16),
    baseline: `M ${f.plotL} ${f.baseY} L ${f.plotR} ${f.baseY}`,
    gridYs: [0.25, 0.5, 0.75].map((t) => f.baseY - t * range),
    plotL: f.plotL,
    plotR: f.plotR,
    baseY: f.baseY,
    valueLabels,
    valSize: f.valSize,
    spines,
    topPath,
  };
}

interface ChartLineGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  linePath: string;
  areaPath: string;
  points: Array<{ x: number; y: number }>;
  baseline: string;
  gridYs: number[];
  plotL: number;
  plotR: number;
  baseY: number;
  valueLabels: ChartValueLabel[];
  valSize: number;
}

function chartLineGeo(
  spec: Extract<PreviewSpec, { layout: 'chart-line' }>,
  d: Dims
): ChartLineGeo {
  const sats = spec.satellites.slice(0, 8);
  const N = Math.max(sats.length, 1);
  const f = chartFrame(d);
  const values = chartSeries(sats, 'chart-line');
  const vmax = Math.max(...values, 1);
  const range = f.baseY - f.plotTop;
  const step = (f.plotR - f.plotL) / N;

  const tiles: PositionedTile[] = [
    {
      key: spec.center.key,
      icon: spec.center.icon,
      label: spec.center.label,
      x: f.ix + d.tileLarge * 0.5,
      y: f.top + d.tileLarge * 0.5,
      size: d.tileLarge,
      center: true,
      flush: spec.center.flush,
    },
  ];
  const points: Array<{ x: number; y: number }> = [];
  const valueLabels: ChartValueLabel[] = [];
  sats.forEach((s, i) => {
    const x = f.plotL + step * (i + 0.5);
    const y = f.baseY - Math.max(range * 0.06, (values[i] / vmax) * range);
    points.push({ x, y });
    valueLabels.push({
      x,
      y: y - f.valSize * 1.1,
      text: fmtChartValue(values[i], s.unit),
    });
    tiles.push({
      key: s.key,
      icon: s.icon,
      label: s.label,
      x,
      y: f.tileY,
      size: d.tileBase,
      flush: s.flush,
    });
  });

  // Smooth Catmull-Rom → cubic-bezier curve through the points.
  let linePath = '';
  if (points.length === 1) {
    linePath = `M ${points[0].x} ${points[0].y}`;
  } else {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      linePath += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
  }
  const last = points[points.length - 1];
  const first = points[0];
  const areaPath = `${linePath} L ${last.x} ${f.baseY} L ${first.x} ${f.baseY} Z`;

  return {
    tiles,
    edges: [],
    linePath,
    areaPath,
    points,
    baseline: `M ${f.plotL} ${f.baseY} L ${f.plotR} ${f.baseY}`,
    gridYs: [0.25, 0.5, 0.75].map((t) => f.baseY - t * range),
    plotL: f.plotL,
    plotR: f.plotR,
    baseY: f.baseY,
    valueLabels,
    valSize: f.valSize,
  };
}

interface DonutGeo {
  tiles: PositionedTile[];
  edges: Edge[];
  cx: number;
  cy: number;
  r: number;
  thickness: number;
  segments: Array<{
    path: string;
    color: string;
    midAngle: number;
    share: number;
  }>;
  /** Full ring circle path for orbiting mode accents. */
  ringPath: string;
  shareLabels: ChartValueLabel[];
  valSize: number;
}

function donutGeo(
  spec: Extract<PreviewSpec, { layout: 'donut' }>,
  d: Dims
): DonutGeo {
  const sats = spec.satellites.slice(0, 6);
  const values = chartSeries(sats, 'donut');
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const palette = chartPalette(spec.accent || '#ff5b8a');
  const padEst = tilePad(d);
  const labelSpace = d.labelSize > 0 ? d.labelSize + 10 : 4;
  const cx = d.W / 2;
  const cy = (d.H - labelSpace * 0.6) / 2;
  const thickness = Math.max(10, d.tileBase * 0.52);
  // Ring sized so the satellite tiles (placed just outside it) stay in frame,
  // including the top edge where tiles have no label but do have a shadow.
  const tileReach = thickness / 2 + (d.tileBase + padEst) * 0.62 + 6;
  const r = Math.max(
    d.tileLarge * 1.05,
    Math.min(d.W, d.H) / 2 - d.margin * 0.52 - tileReach
  );
  const valSize = Math.max(9, d.labelSize + 1);

  const gap = 0.045; // radians between segments
  const polar = (angle: number, radius: number) => ({
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  });

  const tiles: PositionedTile[] = [
    {
      key: spec.center.key,
      icon: spec.center.icon,
      label: spec.center.label,
      x: cx,
      y: cy,
      size: d.tileLarge,
      center: true,
      flush: spec.center.flush,
    },
  ];
  const segments: DonutGeo['segments'] = [];
  const shareLabels: ChartValueLabel[] = [];
  let angle = -Math.PI / 2;
  sats.forEach((s, i) => {
    const share = values[i] / total;
    const sweep = share * Math.PI * 2 - gap;
    const a0 = angle + gap / 2;
    const a1 = a0 + Math.max(sweep, 0.02);
    const mid = (a0 + a1) / 2;
    const s0 = polar(a0, r);
    const s1 = polar(a1, r);
    segments.push({
      path: `M ${s0.x.toFixed(1)} ${s0.y.toFixed(1)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${s1.x.toFixed(1)} ${s1.y.toFixed(1)}`,
      color: palette[i % palette.length],
      midAngle: mid,
      share,
    });
    // % on the band when the slice can fit it, otherwise skip (the tile's
    // label still names the slice).
    if (share >= 0.07) {
      const p = polar(mid, r);
      // Fixed precision: trig can differ in the last ulp between server and
      // client, which would trip hydration on SSR-rendered previews.
      shareLabels.push({
        x: Number(p.x.toFixed(2)),
        y: Number(p.y.toFixed(2)),
        text:
          s.unit === '%'
            ? fmtChartValue(values[i], '%')
            : `${Math.round(share * 100)}%`,
      });
    }
    angle = a0 + share * Math.PI * 2 - gap / 2;
  });

  // Place the satellite tiles at their segment mid-angles, then relax
  // neighbours apart so tiny adjacent slices (3%, 5%…) don't stack their
  // callout tiles on top of each other.
  const tileR = r + tileReach;
  const minSep =
    2 * Math.asin(Math.min(0.95, ((d.tileBase + tilePad(d)) * 0.6) / tileR));
  const tileAngles = segments.map((seg) => seg.midAngle);
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < tileAngles.length; i++) {
      const delta = tileAngles[i] - tileAngles[i - 1];
      if (delta < minSep) {
        const push = (minSep - delta) / 2;
        tileAngles[i - 1] -= push;
        tileAngles[i] += push;
      }
    }
  }
  sats.forEach((s, i) => {
    const tp = polar(tileAngles[i], tileR);
    tiles.push({
      key: s.key,
      icon: s.icon,
      label: s.label,
      x: tp.x,
      y: tp.y,
      size: d.tileBase,
      flush: s.flush,
    });
  });

  return {
    tiles,
    edges: [],
    cx,
    cy,
    r,
    thickness,
    segments,
    ringPath: `M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy}`,
    shareLabels,
    valSize,
  };
}

function computeLayout(spec: PreviewSpec, d: Dims) {
  switch (spec.layout) {
    case 'hub-lr':
      return hubLRLayout(spec, d);
    case 'pipeline':
      return pipelineLayout(spec, d);
    case 'radial':
      return radialLayout(spec, d);
    case 'tree':
      return treeLayout(spec, d);
    case 'orbit':
      return orbitLayout(spec, d);
    case 'cycle':
      return cycleLayout(spec, d);
    case 'steps': {
      const { tiles, edges } = stepsGeo(spec, d);
      return { tiles, edges };
    }
    case 'funnel': {
      const { tiles, edges } = funnelGeo(spec, d);
      return { tiles, edges };
    }
    case 'pyramid': {
      const { tiles, edges } = pyramidGeo(spec, d);
      return { tiles, edges };
    }
    case 'quadrant': {
      const { tiles, edges } = quadrantGeo(spec, d);
      return { tiles, edges };
    }
    case 'columns': {
      const { tiles, edges } = columnsGeo(spec, d);
      return { tiles, edges };
    }
    case 'timeline': {
      const { tiles, edges } = timelineGeo(spec, d);
      return { tiles, edges };
    }
    case 'iceberg': {
      const { tiles, edges } = icebergGeo(spec, d);
      return { tiles, edges };
    }
    case 'iso-steps': {
      const { tiles, edges } = isoGeo(spec, d);
      return { tiles, edges };
    }
    case 'bars': {
      const { tiles, edges } = barsGeo(spec, d);
      return { tiles, edges };
    }
    case 'chart-line': {
      const { tiles, edges } = chartLineGeo(spec, d);
      return { tiles, edges };
    }
    case 'donut': {
      const { tiles, edges } = donutGeo(spec, d);
      return { tiles, edges };
    }
  }
}

function pathFor(
  edge: Edge,
  byKey: Record<string, { x: number; y: number }>
): string {
  const a = byKey[edge.from];
  const b = byKey[edge.to];
  if (!a || !b) return '';
  switch (edge.kind) {
    case 'curve-h': {
      const cp = (a.x + b.x) / 2;
      return `M ${a.x} ${a.y} Q ${cp} ${b.y}, ${b.x} ${b.y}`;
    }
    case 'line':
      return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    case 'bracket-v': {
      const midY = (a.y + b.y) / 2;
      return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
    }
    case 'cubic': {
      const cp1x = a.x + (b.x - a.x) * 0.5;
      return `M ${a.x} ${a.y} C ${cp1x} ${a.y}, ${cp1x} ${b.y}, ${b.x} ${b.y}`;
    }
    case 'arc': {
      // Outward-bowing quadratic: (dy,-dx) is 90° right of travel — away from
      // the loop center for a clockwise cycle.
      const k = edge.bow ?? 0.3;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      return `M ${a.x} ${a.y} Q ${mx + dy * k} ${my - dx * k}, ${b.x} ${b.y}`;
    }
  }
}

/** Selection ring colour — a distinct blue so it never clashes with the pink beams. */
const SELECTION_COLOR = '#2563eb';

export interface AnimatedPreviewProps {
  variant?: 'home' | 'canvas';
  /** Override the native layout frame (e.g. WIDE_DIMS for horizontal cards). */
  dims?: Dims;
  modeOverride?: PreviewMode;
  showModeChip?: boolean;
  editable?: boolean;
  speed?: number;
  positionOverrides?: Record<string, { x: number; y: number }>;
  labelOverrides?: Record<string, string>;
  onPositionChange?: (key: string, x: number, y: number) => void;
  onLabelChange?: (key: string, label: string) => void;
  /** Key of the currently selected element (drives the inspector + selection ring). */
  selectedKey?: string | null;
  /** Fired when a tile is selected, or null when the empty canvas is clicked. */
  onSelect?: (key: string | null) => void;
}

export function AnimatedPreview(props: PreviewSpec & AnimatedPreviewProps) {
  const {
    variant = 'home',
    dims: dimsOverride,
    modeOverride,
    showModeChip = true,
    editable = false,
    speed = 1,
    positionOverrides = {},
    labelOverrides = {},
    onPositionChange,
    onLabelChange,
    selectedKey = null,
    onSelect,
    ...specProps
  } = props as any;
  const spec = specProps as PreviewSpec;

  const dims = dimsOverride ?? (variant === 'canvas' ? CANVAS_DIMS : HOME_DIMS);
  const layout = computeLayout(spec, dims);
  const orbit = spec.layout === 'orbit' ? computeOrbit(spec, dims) : null;
  // Shape chrome geometries (pure recompute; cheap relative to render)
  const stepsG = spec.layout === 'steps' ? stepsGeo(spec, dims) : null;
  const funnelG = spec.layout === 'funnel' ? funnelGeo(spec, dims) : null;
  const pyramidG = spec.layout === 'pyramid' ? pyramidGeo(spec, dims) : null;
  const quadG = spec.layout === 'quadrant' ? quadrantGeo(spec, dims) : null;
  const colsG = spec.layout === 'columns' ? columnsGeo(spec, dims) : null;
  const tlG = spec.layout === 'timeline' ? timelineGeo(spec, dims) : null;
  const bergG = spec.layout === 'iceberg' ? icebergGeo(spec, dims) : null;
  const isoG = spec.layout === 'iso-steps' ? isoGeo(spec, dims) : null;
  const barsG = spec.layout === 'bars' ? barsGeo(spec, dims) : null;
  const lineG = spec.layout === 'chart-line' ? chartLineGeo(spec, dims) : null;
  const donutG = spec.layout === 'donut' ? donutGeo(spec, dims) : null;

  // Apply position overrides on top of computed layout
  const tiles = layout.tiles.map((t) => {
    const ov = positionOverrides[t.key];
    return ov ? { ...t, x: ov.x, y: ov.y } : t;
  });

  const byKey: Record<string, { x: number; y: number }> = {};
  for (const t of tiles) byKey[t.key] = { x: t.x, y: t.y };

  const mode = (modeOverride ?? spec.mode) as PreviewMode;
  const accent = spec.accent || '#ff5b8a';
  const gradId = `beam-grad-${variant}-${mode}-${spec.layout}`;

  const sm = (s: number) => `${(s / Math.max(speed, 0.05)).toFixed(2)}s`;

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragKey = useRef<string | null>(null);
  const dragOffset = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const toSvg = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((clientX - rect.left) / rect.width) * dims.W,
      y: ((clientY - rect.top) / rect.height) * dims.H,
    };
  };

  const beginDrag = (key: string) => (e: PointerEvent<HTMLDivElement>) => {
    if (!editable || !onPositionChange) return;
    e.preventDefault();
    const tile = tiles.find((t) => t.key === key);
    if (!tile) return;
    const p = toSvg(e.clientX, e.clientY);
    dragOffset.current = { dx: p.x - tile.x, dy: p.y - tile.y };
    dragKey.current = key;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const moveDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragKey.current || !onPositionChange) return;
    const p = toSvg(e.clientX, e.clientY);
    onPositionChange(
      dragKey.current,
      p.x - dragOffset.current.dx,
      p.y - dragOffset.current.dy
    );
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragKey.current) return;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    dragKey.current = null;
  };

  return (
    <div
      ref={containerRef}
      // Flags the diagram's own backdrop for the export pipeline: transparent
      // PNG/SVG exports temporarily clear inline backgrounds carrying this
      // attribute (see stripExportBackgrounds in use-export).
      data-export-bg
      className={
        variant === 'canvas'
          ? 'relative w-full h-full overflow-hidden rounded-xl select-none'
          : 'absolute inset-0 overflow-hidden'
      }
      style={{
        background:
          spec.bg ||
          (variant === 'canvas'
            ? 'transparent'
            : 'linear-gradient(135deg,#fafafa 0%,#ffffff 100%)'),
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${dims.W} ${dims.H}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Soft drop shadow for orbit satellite tiles (SVG-native, so it
              survives the standalone rasterization in exports). */}
          <filter
            id={`${gradId}-satshadow`}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1.6"
              floodColor="#0f2a3e"
              floodOpacity="0.16"
            />
          </filter>
          {stepsG && (
            <linearGradient
              id={`${gradId}-stairfill`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="rgba(15,42,62,0.03)" />
              <stop offset="100%" stopColor="rgba(15,42,62,0.075)" />
            </linearGradient>
          )}
          {lineG && (
            <linearGradient
              id={`${gradId}-areafill`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
              <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
            </linearGradient>
          )}
          {quadG && (
            <>
              {/* userSpaceOnUse: a vertical line has a zero-width bbox, so an
                  objectBoundingBox gradient would be degenerate on it. */}
              <linearGradient
                id={`${gradId}-qh`}
                gradientUnits="userSpaceOnUse"
                x1={quadG.axis.hx0}
                y1={quadG.cy}
                x2={quadG.axis.hx1}
                y2={quadG.cy}
              >
                <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
                <stop offset="50%" stopColor={accent} stopOpacity="1" />
                <stop offset="100%" stopColor={accent} stopOpacity="0.35" />
              </linearGradient>
              <linearGradient
                id={`${gradId}-qv`}
                gradientUnits="userSpaceOnUse"
                x1={quadG.cx}
                y1={quadG.axis.vy0}
                x2={quadG.cx}
                y2={quadG.axis.vy1}
              >
                <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
                <stop offset="50%" stopColor={accent} stopOpacity="1" />
                <stop offset="100%" stopColor={accent} stopOpacity="0.35" />
              </linearGradient>
            </>
          )}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,107,157,0)" />
            <stop offset="50%" stopColor={accent} stopOpacity="0.95" />
            <stop offset="100%" stopColor="rgba(255,107,157,0)" />
          </linearGradient>
          {/* Canvas beam gradient: glows brightest mid-edge but never goes fully
              transparent at the ends, so the beam keeps its soft gradient look
              yet still visibly reaches the nodes (flows end-to-end). */}
          <linearGradient
            id={`${gradId}-glow`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="50%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {layout.edges.map((e, i) => {
          const d = pathFor(e, byKey);
          const dotR = variant === 'canvas' ? 5 : 3.2;
          const beamW = variant === 'canvas' ? 4 : 3;
          const beamDash = variant === 'canvas' ? '120 520' : '60 260';
          const beamOffset = variant === 'canvas' ? 640 : 320;
          const arrowScale = variant === 'canvas' ? 1.8 : 1;
          const pulseMax = variant === 'canvas' ? 14 : 7;
          const pulseEnd = variant === 'canvas' ? 6 : 3;

          return (
            <g key={e.key}>
              <path
                d={d}
                stroke="rgba(15,42,62,0.14)"
                strokeWidth={variant === 'canvas' ? 1.6 : 1.1}
                strokeDasharray={variant === 'canvas' ? '6 6' : '3 4'}
                fill="none"
              />

              {mode === 'beams' &&
                (variant === 'canvas' ? (
                  // Canvas edges vary in length, so the original fixed dash
                  // pattern (longer than short edges) made the beam blink and
                  // stall before the nodes. Normalise the path to 100 units so
                  // one soft gradient segment sweeps the FULL edge every cycle;
                  // the `-glow` gradient keeps the beam visible at the nodes
                  // (end-to-end) while preserving the gradient look.
                  <path
                    d={d}
                    pathLength={100}
                    stroke={`url(#${gradId}-glow)`}
                    strokeWidth={beamW}
                    strokeLinecap="round"
                    strokeDasharray="40 60"
                    fill="none"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from={100}
                      to={0}
                      dur={sm(2.4)}
                      begin={`${i * 0.2}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                ) : (
                  <path
                    d={d}
                    stroke={`url(#${gradId})`}
                    strokeWidth={beamW}
                    strokeDasharray={beamDash}
                    fill="none"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from={beamOffset}
                      to={0}
                      dur={sm(2.4)}
                      begin={`${i * 0.2}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                ))}

              {mode === 'dots' &&
                [0, 0.35, 0.7].map((offset) => (
                  <circle key={`${e.key}-dot-${offset}`} r={dotR} fill={accent}>
                    <animateMotion
                      dur={sm(2.6)}
                      repeatCount="indefinite"
                      path={d}
                      begin={`${offset + i * 0.15}s`}
                    />
                  </circle>
                ))}

              {mode === 'arrows' && (
                <path
                  d={`M ${-5 * arrowScale},${-3 * arrowScale} L ${5 * arrowScale},0 L ${-5 * arrowScale},${3 * arrowScale} Z`}
                  fill={accent}
                >
                  <animateMotion
                    dur={sm(2.2)}
                    repeatCount="indefinite"
                    path={d}
                    rotate="auto"
                    begin={`${i * 0.15}s`}
                  />
                </path>
              )}

              {mode === 'pulses' &&
                [0, 0.8].map((offset) => (
                  <circle
                    key={`${e.key}-pulse-${offset}`}
                    r="0"
                    fill={accent}
                    fillOpacity="0.25"
                    stroke={accent}
                    strokeWidth="1.5"
                    opacity="0"
                  >
                    <animateMotion
                      dur={sm(2.4)}
                      repeatCount="indefinite"
                      path={d}
                      begin={`${offset + i * 0.15}s`}
                    />
                    <animate
                      attributeName="r"
                      values={`0;${pulseMax};${pulseEnd}`}
                      dur={sm(2.4)}
                      begin={`${offset + i * 0.15}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.95;0"
                      dur={sm(2.4)}
                      begin={`${offset + i * 0.15}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
            </g>
          );
        })}

        {orbit &&
          (() => {
            const dotR = variant === 'canvas' ? 5 : 3.2;
            const beamW = variant === 'canvas' ? 4 : 3;
            const arrowScale = variant === 'canvas' ? 1.8 : 1;
            const outermost = Math.max(...orbit.rings.map((r) => r.r));
            const fontStack =
              'ui-sans-serif, system-ui, -apple-system, sans-serif';
            return (
              <g>
                {orbit.rings.map((ring, ri) => (
                  <g key={`orbit-ring-${ri}`}>
                    {/* the orbit path */}
                    <circle
                      cx={orbit.cx}
                      cy={orbit.cy}
                      r={ring.r}
                      fill="none"
                      stroke="rgba(15,42,62,0.14)"
                      strokeWidth={variant === 'canvas' ? 1.6 : 1.1}
                      strokeDasharray={variant === 'canvas' ? '6 6' : '3 4'}
                    />

                    {/* mode accents travelling the ring */}
                    {mode === 'beams' && (
                      <circle
                        cx={orbit.cx}
                        cy={orbit.cy}
                        r={ring.r}
                        fill="none"
                        pathLength={100}
                        stroke={`url(#${gradId}-glow)`}
                        strokeWidth={beamW}
                        strokeLinecap="round"
                        strokeDasharray="30 70"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from={ring.dir > 0 ? 100 : -100}
                          to={0}
                          dur={sm(3.2)}
                          begin={`${ri * 0.4}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {mode === 'dots' &&
                      [0, 120, 240].map((a0) => (
                        <g
                          key={`od-${a0}`}
                          transform={`translate(${orbit.cx} ${orbit.cy}) rotate(${a0})`}
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            additive="sum"
                            from="0 0 0"
                            to={`${ring.dir * 360} 0 0`}
                            dur={sm(ring.period * 0.45)}
                            repeatCount="indefinite"
                          />
                          <circle cx={ring.r} cy={0} r={dotR} fill={accent} />
                        </g>
                      ))}
                    {mode === 'arrows' &&
                      [0, 180].map((a0) => (
                        <g
                          key={`oa-${a0}`}
                          transform={`translate(${orbit.cx} ${orbit.cy}) rotate(${a0})`}
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            additive="sum"
                            from="0 0 0"
                            to={`${ring.dir * 360} 0 0`}
                            dur={sm(ring.period * 0.5)}
                            repeatCount="indefinite"
                          />
                          <path
                            transform={`translate(${ring.r} 0) rotate(${ring.dir > 0 ? 90 : -90})`}
                            d={`M ${-5 * arrowScale},${-3 * arrowScale} L ${5 * arrowScale},0 L ${-5 * arrowScale},${3 * arrowScale} Z`}
                            fill={accent}
                          />
                        </g>
                      ))}
                  </g>
                ))}

                {mode === 'pulses' &&
                  [0, 1.4].map((off) => (
                    <circle
                      key={`op-${off}`}
                      cx={orbit.cx}
                      cy={orbit.cy}
                      r={0}
                      fill="none"
                      stroke={accent}
                      strokeWidth={variant === 'canvas' ? 2 : 1.5}
                      opacity={0}
                    >
                      <animate
                        attributeName="r"
                        values={`${dims.tileLarge * 0.55};${outermost}`}
                        dur={sm(2.8)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.55;0"
                        dur={sm(2.8)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}

                {/* the revolving satellites — counter-rotated to stay upright */}
                {orbit.rings.map((ring, ri) =>
                  ring.sats.map((sat, i) => {
                    const a0 = orbitStartAngle(ring, i);
                    const s = ring.size;
                    const iconInset = s * 0.62;
                    const selected = selectedKey === sat.key;
                    const label = labelOverrides[sat.key] ?? sat.label;
                    return (
                      <g
                        key={sat.key}
                        transform={`translate(${orbit.cx} ${orbit.cy}) rotate(${a0})`}
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          additive="sum"
                          from="0 0 0"
                          to={`${ring.dir * 360} 0 0`}
                          dur={sm(ring.period)}
                          repeatCount="indefinite"
                        />
                        <g transform={`translate(${ring.r} 0) rotate(${-a0})`}>
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            additive="sum"
                            from="0 0 0"
                            to={`${-ring.dir * 360} 0 0`}
                            dur={sm(ring.period)}
                            repeatCount="indefinite"
                          />
                          <rect
                            x={-s / 2}
                            y={-s / 2}
                            width={s}
                            height={s}
                            rx={s * 0.28}
                            fill="#ffffff"
                            stroke={
                              selected ? SELECTION_COLOR : 'rgba(15,42,62,0.12)'
                            }
                            strokeWidth={selected ? 2 : 1}
                            filter={`url(#${gradId}-satshadow)`}
                          />
                          {sat.svgIcon ? (
                            <svg
                              x={-iconInset / 2}
                              y={-iconInset / 2}
                              width={iconInset}
                              height={iconInset}
                            >
                              {sat.svgIcon}
                            </svg>
                          ) : (
                            <>
                              <rect
                                x={-s / 2}
                                y={-s / 2}
                                width={s}
                                height={s}
                                rx={s * 0.28}
                                fill={sat.tint ?? accent}
                                opacity={0.13}
                              />
                              <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize={s * 0.42}
                                fontWeight={700}
                                fill={sat.tint ?? accent}
                                fontFamily={fontStack}
                              >
                                {sat.letter ??
                                  (sat.label ?? '?').charAt(0).toUpperCase()}
                              </text>
                            </>
                          )}
                          {dims.labelSize > 0 && label ? (
                            <text
                              y={s / 2 + dims.labelSize + 6}
                              textAnchor="middle"
                              fontSize={dims.labelSize}
                              fontWeight={600}
                              fill="#0f2a3e"
                              stroke="#ffffff"
                              strokeWidth={3}
                              paintOrder="stroke"
                              fontFamily={fontStack}
                            >
                              {label}
                            </text>
                          ) : null}
                        </g>
                      </g>
                    );
                  })
                )}
              </g>
            );
          })()}

        {/* cycle: static directional arrowheads on the arc gaps (drag-following) */}
        {spec.layout === 'cycle' &&
          layout.edges.map((e) => {
            const a = byKey[e.from];
            const b = byKey[e.to];
            if (!a || !b) return null;
            const k = e.bow ?? 0.3;
            const C = {
              x: (a.x + b.x) / 2 + (b.y - a.y) * k,
              y: (a.y + b.y) / 2 - (b.x - a.x) * k,
            };
            const qp = (t: number) => ({
              x: (1 - t) * (1 - t) * a.x + 2 * t * (1 - t) * C.x + t * t * b.x,
              y: (1 - t) * (1 - t) * a.y + 2 * t * (1 - t) * C.y + t * t * b.y,
            });
            const qt = (t: number) => ({
              x: 2 * ((1 - t) * (C.x - a.x) + t * (b.x - C.x)),
              y: 2 * ((1 - t) * (C.y - a.y) + t * (b.y - C.y)),
            });
            const clear = dims.tileBase * 1.15;
            const leg = Math.max(Math.hypot(b.x - C.x, b.y - C.y), 1);
            const t = Math.min(0.98, Math.max(0.55, 1 - clear / (2 * leg)));
            const p = qp(t);
            const g2 = qt(t);
            const ang = (Math.atan2(g2.y, g2.x) * 180) / Math.PI;
            const Ln = Math.min(15, Math.max(4, dims.tileBase * 0.32));
            return (
              <path
                key={`cyc-ah-${e.key}`}
                transform={`translate(${p.x} ${p.y}) rotate(${ang})`}
                d={`M ${-Ln} ${-Ln * 0.62} L 0 0 L ${-Ln} ${Ln * 0.62} Z`}
                fill="rgba(15,42,62,0.35)"
              />
            );
          })}

        {/* steps: staircase silhouette + summit pennant (motion rides the edges) */}
        {stepsG && (
          <g>
            <path
              d={stepsG.fillD}
              fill={`url(#${gradId}-stairfill)`}
              stroke="none"
            />
            <path
              d={stepsG.profileD}
              fill="none"
              stroke="rgba(15,42,62,0.20)"
              strokeWidth={variant === 'canvas' ? 1.6 : 1.1}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {stepsG.shadows.map((s, i) => (
              <ellipse
                key={`st-sh-${i}`}
                cx={s.cx}
                cy={s.cy}
                rx={s.rx}
                ry={s.ry}
                fill="rgba(15,42,62,0.07)"
              />
            ))}
            {stepsG.flag && (
              <>
                <line
                  x1={stepsG.flag.x}
                  y1={stepsG.landingY}
                  x2={stepsG.flag.x}
                  y2={stepsG.flag.top}
                  stroke="rgba(15,42,62,0.35)"
                  strokeWidth={variant === 'canvas' ? 1.6 : 1.1}
                  strokeLinecap="round"
                />
                <path
                  d={`M ${stepsG.flag.x} ${stepsG.flag.top} L ${stepsG.flag.x - stepsG.flag.poleH * 0.62} ${stepsG.flag.top + stepsG.flag.poleH * 0.225} L ${stepsG.flag.x} ${stepsG.flag.top + stepsG.flag.poleH * 0.45} Z`}
                  fill={accent}
                  fillOpacity="0.9"
                />
                <circle
                  cx={stepsG.flag.x}
                  cy={stepsG.landingY}
                  r="1.6"
                  fill="rgba(15,42,62,0.35)"
                />
              </>
            )}
          </g>
        )}

        {/* iso-steps: isometric cube staircase, all-SVG (labels + logo included)
            so the export pipeline captures the full visual in the animated
            layer. A lift+flash wave rides the numbering order on one shared
            SMIL clock. */}
        {spec.layout === 'iso-steps' &&
          isoG &&
          (() => {
            const g = isoG;
            const s = g.s;
            const front = accent;
            const side = isoShade(accent, -0.16);
            const top = isoShade(accent, 0.18);
            const outline = isoShade(accent, -0.62);
            const P = g.period;
            const pc = (t: number) =>
              Math.min(1, Math.max(0, t / P)).toFixed(4);

            // face corner math — u right-down, dd right-up, w straight up
            const facesFor = (x: number, y: number) => {
              const ux = 0.866 * s;
              const uy = 0.5 * s;
              const topD = `M ${x} ${y - s} L ${x + ux} ${y - s + uy} L ${x + 2 * ux} ${y - s} L ${x + ux} ${y - s - uy} Z`;
              const sideD = `M ${x + ux} ${y + uy} L ${x + 2 * ux} ${y} L ${x + 2 * ux} ${y - s} L ${x + ux} ${y - s + uy} Z`;
              const frontD = `M ${x} ${y} L ${x + ux} ${y + uy} L ${x + ux} ${y - s + uy} L ${x} ${y - s} Z`;
              return { topD, sideD, frontD };
            };
            const faceProps = (selected: boolean) => ({
              stroke: selected ? SELECTION_COLOR : outline,
              strokeWidth: selected ? g.sw * 1.25 : g.sw,
              strokeLinejoin: 'round' as const,
            });

            return (
              <g>
                {g.cubes.map((cube) => {
                  const t0 = g.lead + cube.k * g.gap;
                  const kt = `0;${pc(t0)};${pc(t0 + 0.28)};${pc(t0 + 0.55)};1`;
                  const label = labelOverrides[cube.key] ?? cube.label;
                  const fs =
                    s *
                    0.38 *
                    Math.min(1, 2.6 / Math.max(1, (label ?? '').length));
                  const { topD, sideD, frontD } = facesFor(cube.x, cube.y);
                  const fp = faceProps(selectedKey === cube.key);
                  return (
                    <g key={cube.key}>
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values={`0 0;0 0;0 ${-g.lift};0 0;0 0`}
                        keyTimes={kt}
                        dur={sm(P)}
                        repeatCount="indefinite"
                      />
                      <path d={topD} fill={top} {...fp} />
                      <path d={sideD} fill={side} {...fp} />
                      <path d={frontD} fill={front} {...fp} />
                      <path d={frontD} fill="#ffffff" opacity={0}>
                        <animate
                          attributeName="opacity"
                          values="0;0;0.32;0;0"
                          keyTimes={kt}
                          dur={sm(P)}
                          repeatCount="indefinite"
                        />
                      </path>
                      {label ? (
                        <g
                          transform={`matrix(0.866,0.5,0,1,${cube.x},${cube.y - s})`}
                        >
                          <text
                            x={s * 0.5}
                            y={s * 0.64}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontWeight={800}
                            fontSize={fs}
                            fontFamily={CHART_FONT}
                          >
                            {label}
                          </text>
                        </g>
                      ) : null}
                    </g>
                  );
                })}

                {/* the white logo cube crowning the stack */}
                {(() => {
                  const t0 = g.lead + g.cubes.length * g.gap;
                  const kt = `0;${pc(t0)};${pc(t0 + 0.3)};${pc(t0 + 0.6)};1`;
                  const { topD, sideD, frontD } = facesFor(g.logo.x, g.logo.y);
                  const fp = faceProps(selectedKey === spec.center.key);
                  const inset = s * 0.62;
                  return (
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values={`0 0;0 0;0 ${-g.lift * 0.9};0 0;0 0`}
                        keyTimes={kt}
                        dur={sm(P)}
                        repeatCount="indefinite"
                      />
                      <path d={topD} fill="#ffffff" {...fp} />
                      <path d={sideD} fill="#EDEBE6" {...fp} />
                      <path d={frontD} fill="#FBFAF7" {...fp} />
                      <g
                        transform={`matrix(0.866,0.5,0,1,${g.logo.x},${g.logo.y - s})`}
                      >
                        {spec.center.svgIcon ? (
                          <svg
                            x={(s - inset) / 2}
                            y={(s - inset) / 2 - s * 0.04}
                            width={inset}
                            height={inset}
                          >
                            {spec.center.svgIcon}
                          </svg>
                        ) : (
                          <text
                            x={s * 0.5}
                            y={s * 0.66}
                            textAnchor="middle"
                            fontWeight={800}
                            fontSize={s * 0.44}
                            fill={spec.center.tint ?? accent}
                            fontFamily={CHART_FONT}
                          >
                            {spec.center.letter ??
                              (spec.center.label ?? '?').charAt(0)}
                          </text>
                        )}
                      </g>
                    </g>
                  );
                })()}
              </g>
            );
          })()}

        {/* funnel / pyramid: banded silhouettes + leader rails + mode motion */}
        {(funnelG || pyramidG) &&
          (() => {
            const g = (funnelG ?? pyramidG) as NonNullable<typeof funnelG> &
              Partial<NonNullable<typeof pyramidG>>;
            const bands = g.bands;
            const L = bands.length;
            // funnel flows top→down; pyramid rises bottom→up
            const delay = (j: number) =>
              funnelG ? j * 0.18 : (L - 1 - j) * 0.18;
            const rails = funnelG
              ? [funnelG.wallL, funnelG.wallR]
              : [pyramidG!.slopeL, pyramidG!.slopeR];
            const dotR = variant === 'canvas' ? 5 : 3.2;
            const beamW = variant === 'canvas' ? 4 : 3;
            const s = variant === 'canvas' ? 1.8 : 1;
            const structW = variant === 'canvas' ? 1.6 : 1.1;
            const structDash = variant === 'canvas' ? '6 6' : '3 4';
            const haloX = funnelG ? funnelG.cx : pyramidG!.cx;
            const haloY = funnelG ? funnelG.outcomeY : pyramidG!.topY;
            return (
              <g>
                {bands.map((b, j) => (
                  <polygon
                    key={`bd-${j}`}
                    points={b.points}
                    fill={accent}
                    fillOpacity={b.fillOp}
                    stroke="none"
                  >
                    {mode === 'pulses' && (
                      <animate
                        attributeName="fill-opacity"
                        values={`${b.fillOp};${Math.min(b.fillOp * 2.1, 0.6)};${b.fillOp}`}
                        dur={sm(2.8)}
                        begin={`${delay(j)}s`}
                        repeatCount="indefinite"
                      />
                    )}
                  </polygon>
                ))}
                {rails.map((r, i) => (
                  <path
                    key={`rail-${i}`}
                    d={r}
                    fill="none"
                    stroke="rgba(15,42,62,0.14)"
                    strokeWidth={structW}
                    strokeDasharray={structDash}
                  />
                ))}
                {pyramidG && (
                  <path
                    d={pyramidG.baseLine}
                    fill="none"
                    stroke="rgba(15,42,62,0.14)"
                    strokeWidth={structW}
                    strokeDasharray={structDash}
                  />
                )}
                {funnelG && (
                  <path
                    d={funnelG.spoutDrop}
                    fill="none"
                    stroke="rgba(15,42,62,0.2)"
                    strokeWidth={structW}
                  />
                )}
                {bands.map((b, j) => (
                  <path
                    key={`ld-${j}`}
                    d={b.leader}
                    fill="none"
                    stroke="rgba(15,42,62,0.14)"
                    strokeWidth={structW}
                    strokeDasharray={structDash}
                  />
                ))}

                {mode === 'dots' &&
                  bands.map((b, j) =>
                    [0, 1.1].map((off) => (
                      <circle key={`fd-${j}-${off}`} r={dotR} fill={accent}>
                        <animateMotion
                          dur={sm(2.6)}
                          repeatCount="indefinite"
                          path={b.leader.replace('M', 'M ').trim()}
                          begin={`${delay(j) + off}s`}
                        />
                      </circle>
                    ))
                  )}
                {mode === 'dots' &&
                  rails.map((r, i) => (
                    <circle key={`fdr-${i}`} r={dotR} fill={accent}>
                      <animateMotion
                        dur={sm(5.2)}
                        repeatCount="indefinite"
                        path={r}
                        begin={`${i * 0.6}s`}
                      />
                    </circle>
                  ))}

                {mode === 'beams' &&
                  bands.map((b, j) => (
                    <path
                      key={`fb-${j}`}
                      d={b.leader}
                      pathLength={100}
                      stroke={`url(#${gradId}-glow)`}
                      strokeWidth={beamW}
                      strokeLinecap="round"
                      strokeDasharray="45 55"
                      fill="none"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from={100}
                        to={0}
                        dur={sm(2.4)}
                        begin={`${delay(j)}s`}
                        repeatCount="indefinite"
                      />
                    </path>
                  ))}
                {mode === 'beams' &&
                  rails.map((r, i) => (
                    <path
                      key={`fbr-${i}`}
                      d={r}
                      pathLength={100}
                      stroke={`url(#${gradId}-glow)`}
                      strokeWidth={beamW}
                      strokeLinecap="round"
                      strokeDasharray="25 75"
                      fill="none"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from={100}
                        to={0}
                        dur={sm(4.8)}
                        begin={`${i * 0.4}s`}
                        repeatCount="indefinite"
                      />
                    </path>
                  ))}

                {mode === 'pulses' &&
                  [0, 1.4].map((off) => (
                    <circle
                      key={`fp-${off}`}
                      cx={haloX}
                      cy={haloY}
                      r={0}
                      fill="none"
                      stroke={accent}
                      strokeWidth={variant === 'canvas' ? 2 : 1.5}
                      opacity={0}
                    >
                      <animate
                        attributeName="r"
                        values={`${dims.tileLarge * 0.55};${dims.tileLarge * 1.6}`}
                        dur={sm(2.8)}
                        begin={`${off + 0.2}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.5;0"
                        dur={sm(2.8)}
                        begin={`${off + 0.2}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}

                {mode === 'arrows' &&
                  bands.map((b, j) => (
                    <path
                      key={`fa-${j}`}
                      d={`M ${-5 * s},${-3 * s} L ${5 * s},0 L ${-5 * s},${3 * s} Z`}
                      fill={accent}
                    >
                      <animateMotion
                        dur={sm(2.2)}
                        repeatCount="indefinite"
                        path={b.leader}
                        rotate="auto"
                        begin={`${delay(j)}s`}
                      />
                    </path>
                  ))}
                {mode === 'arrows' &&
                  rails.map((r, i) => (
                    <path
                      key={`far-${i}`}
                      d={`M ${-5 * s},${-3 * s} L ${5 * s},0 L ${-5 * s},${3 * s} Z`}
                      fill={accent}
                    >
                      <animateMotion
                        dur={sm(4.4)}
                        repeatCount="indefinite"
                        path={r}
                        rotate="auto"
                        begin={`${i * 0.5}s`}
                      />
                    </path>
                  ))}
              </g>
            );
          })()}

        {/* quadrant: tinted panels + bold cross axis + mode accents */}
        {quadG &&
          (() => {
            const dotR = variant === 'canvas' ? 5 : 3.2;
            const s = variant === 'canvas' ? 1.8 : 1;
            const A = quadG.A;
            const ax = quadG.axis;
            return (
              <g>
                {quadG.cells.map((c, i) =>
                  c.ghost ? (
                    <rect
                      key={`qp-${i}`}
                      x={c.x}
                      y={c.y}
                      width={c.w}
                      height={c.h}
                      rx={Math.max(3, dims.tileBase * 0.28)}
                      fill="rgba(15,42,62,0.03)"
                      stroke="rgba(15,42,62,0.14)"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                  ) : (
                    <rect
                      key={`qp-${i}`}
                      x={c.x}
                      y={c.y}
                      width={c.w}
                      height={c.h}
                      rx={Math.max(3, dims.tileBase * 0.28)}
                      fill={c.tint}
                      fillOpacity={0.09}
                      stroke={c.tint}
                      strokeOpacity={0.18}
                      strokeWidth={1}
                    />
                  )
                )}
                <path
                  d={`${quadG.hPath} ${quadG.vPath}`}
                  stroke="rgba(15,42,62,0.32)"
                  strokeWidth={variant === 'canvas' ? 2.5 : 1.6}
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={`M ${ax.hx1} ${quadG.cy} l ${-A} ${-A * 0.6} l 0 ${A * 1.2} Z`}
                  fill="rgba(15,42,62,0.32)"
                />
                <path
                  d={`M ${ax.hx0} ${quadG.cy} l ${A} ${-A * 0.6} l 0 ${A * 1.2} Z`}
                  fill="rgba(15,42,62,0.32)"
                />
                <path
                  d={`M ${quadG.cx} ${ax.vy0} l ${-A * 0.6} ${A} l ${A * 1.2} 0 Z`}
                  fill="rgba(15,42,62,0.32)"
                />
                <path
                  d={`M ${quadG.cx} ${ax.vy1} l ${-A * 0.6} ${-A} l ${A * 1.2} 0 Z`}
                  fill="rgba(15,42,62,0.32)"
                />

                {mode === 'dots' &&
                  [quadG.hPath, quadG.vPath].map((axisPath, a) =>
                    [0, 1, 2].map((k) => (
                      <circle key={`qd-${a}-${k}`} r={dotR} fill={accent}>
                        <animateMotion
                          dur={sm(3.2)}
                          begin={`${k * 0.5 + a * 0.25}s`}
                          repeatCount="indefinite"
                          path={axisPath}
                        />
                      </circle>
                    ))
                  )}
                {mode === 'beams' && (
                  <>
                    <path
                      d={quadG.hPath}
                      pathLength={100}
                      stroke={`url(#${gradId}-qh)`}
                      fill="none"
                      strokeWidth={variant === 'canvas' ? 4 : 3}
                      strokeLinecap="round"
                      strokeDasharray="40 60"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from={100}
                        to={0}
                        dur={sm(2.8)}
                        begin="0s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      d={quadG.vPath}
                      pathLength={100}
                      stroke={`url(#${gradId}-qv)`}
                      fill="none"
                      strokeWidth={variant === 'canvas' ? 4 : 3}
                      strokeLinecap="round"
                      strokeDasharray="40 60"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from={100}
                        to={0}
                        dur={sm(2.8)}
                        begin="0.7s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </>
                )}
                {mode === 'pulses' &&
                  quadG.cells.map((c, i) =>
                    c.ghost ? null : (
                      <circle
                        key={`qpls-${i}`}
                        cx={c.cx}
                        cy={c.cy}
                        r={0}
                        fill="none"
                        stroke={accent}
                        strokeWidth={variant === 'canvas' ? 2 : 1.5}
                        opacity={0}
                      >
                        <animate
                          attributeName="r"
                          values={`${dims.tileBase * 0.6};${Math.min(c.w, c.h) * 0.46}`}
                          dur={sm(2.6)}
                          begin={`${[0, 0.35, 1.05, 0.7][i]}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0;0.6;0"
                          dur={sm(2.6)}
                          begin={`${[0, 0.35, 1.05, 0.7][i]}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )
                  )}
                {mode === 'arrows' &&
                  quadG.half.map((h, k) => (
                    <path
                      key={`qa-${k}`}
                      d={`M ${-5 * s},${-3 * s} L ${5 * s},0 L ${-5 * s},${3 * s} Z`}
                      fill={accent}
                    >
                      <animateMotion
                        dur={sm(2.2)}
                        begin={`${k * 0.3}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                        path={h}
                      />
                    </path>
                  ))}
                {!quadG.hasCenter && (
                  <circle
                    cx={quadG.cx}
                    cy={quadG.cy}
                    r={dims.tileBase * 0.35}
                    fill="#ffffff"
                    stroke="rgba(15,42,62,0.32)"
                    strokeWidth={2}
                  />
                )}
              </g>
            );
          })()}

        {/* columns: two facing panels + VS divider + mode accents */}
        {colsG &&
          (() => {
            const dotR = variant === 'canvas' ? 5 : 3.2;
            const s = variant === 'canvas' ? 1.8 : 1;
            const structW = variant === 'canvas' ? 1.6 : 1.1;
            return (
              <g>
                {colsG.panels.map((p, i) => (
                  <rect
                    key={`cp-${i}`}
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height={p.h}
                    rx={colsG.rx}
                    fill={p.tint}
                    fillOpacity={0.07}
                    stroke={p.tint}
                    strokeOpacity={0.16}
                    strokeWidth={1}
                  >
                    {mode === 'pulses' && (
                      <animate
                        attributeName="fill-opacity"
                        values="0.07;0.16;0.07"
                        dur={sm(2.8)}
                        begin={`${i * 1.4}s`}
                        repeatCount="indefinite"
                      />
                    )}
                  </rect>
                ))}
                {[colsG.divTop, colsG.divBottom].map((dv, i) => (
                  <path
                    key={`cdv-${i}`}
                    d={dv}
                    fill="none"
                    stroke="rgba(15,42,62,0.2)"
                    strokeWidth={structW}
                    strokeDasharray={variant === 'canvas' ? '6 6' : '3 4'}
                  />
                ))}
                {mode === 'dots' &&
                  colsG.panels.map((p, a) =>
                    [0, 0.9, 1.8].map((off) => (
                      <circle key={`cd-${a}-${off}`} r={dotR} fill={accent}>
                        <animateMotion
                          dur={sm(2.8)}
                          begin={`${off + a * 0.45}s`}
                          repeatCount="indefinite"
                          path={p.spine}
                        />
                      </circle>
                    ))
                  )}
                {mode === 'beams' &&
                  colsG.panels.map((p, i) => (
                    <path
                      key={`cb-${i}`}
                      d={p.spine}
                      pathLength={100}
                      stroke={accent}
                      strokeOpacity={0.55}
                      strokeWidth={variant === 'canvas' ? 4 : 3}
                      strokeLinecap="round"
                      strokeDasharray="35 65"
                      fill="none"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from={100}
                        to={0}
                        dur={sm(2.6)}
                        begin={`${i * 0.6}s`}
                        repeatCount="indefinite"
                      />
                    </path>
                  ))}
                {mode === 'pulses' && (
                  <circle
                    cx={colsG.cx}
                    cy={colsG.cy}
                    r={0}
                    fill="none"
                    stroke={accent}
                    strokeWidth={variant === 'canvas' ? 2 : 1.5}
                    opacity={0}
                  >
                    <animate
                      attributeName="r"
                      values={`${dims.tileLarge * 0.55};${dims.tileLarge * 1.5}`}
                      dur={sm(2.8)}
                      begin="0.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.5;0"
                      dur={sm(2.8)}
                      begin="0.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {mode === 'arrows' &&
                  [colsG.toCenterL, colsG.toCenterR].map((pth, k) => (
                    <path
                      key={`ca-${k}`}
                      d={`M ${-5 * s},${-3 * s} L ${5 * s},0 L ${-5 * s},${3 * s} Z`}
                      fill={accent}
                    >
                      <animateMotion
                        dur={sm(2.2)}
                        begin={`${k * 1.1}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                        path={pth}
                      />
                    </path>
                  ))}
              </g>
            );
          })()}

        {/* timeline: baseline + milestone dots + stems + mode accents */}
        {tlG &&
          (() => {
            const dotR = variant === 'canvas' ? 5 : 3.5;
            const s = variant === 'canvas' ? 1.8 : 1;
            const Ah = Math.max(6, dims.tileBase * 0.22);
            return (
              <g>
                <path
                  d={tlG.linePath}
                  fill="none"
                  stroke="rgba(15,42,62,0.25)"
                  strokeWidth={variant === 'canvas' ? 2 : 1.4}
                  strokeLinecap="round"
                />
                <path
                  d={`M ${tlG.lineEndX + 2} ${tlG.lineY} l ${-Ah} ${-Ah * 0.6} l 0 ${Ah * 1.2} Z`}
                  fill="rgba(15,42,62,0.25)"
                />
                {tlG.dots.map((m, i) => (
                  <g key={`tl-${i}`}>
                    <path
                      d={m.stem}
                      fill="none"
                      stroke="rgba(15,42,62,0.2)"
                      strokeWidth={variant === 'canvas' ? 1.6 : 1.1}
                    />
                    <circle
                      cx={m.x}
                      cy={tlG.lineY}
                      r={dotR}
                      fill="#ffffff"
                      stroke={accent}
                      strokeWidth={2}
                    />
                  </g>
                ))}
                {mode === 'dots' &&
                  [0, 0.9, 1.8].map((off) => (
                    <circle key={`tld-${off}`} r={dotR * 0.7} fill={accent}>
                      <animateMotion
                        dur={sm(3)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                        path={tlG.linePath}
                      />
                    </circle>
                  ))}
                {mode === 'beams' && (
                  <path
                    d={tlG.linePath}
                    pathLength={100}
                    stroke={`url(#${gradId}-glow)`}
                    strokeWidth={variant === 'canvas' ? 4 : 3}
                    strokeLinecap="round"
                    strokeDasharray="35 65"
                    fill="none"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from={100}
                      to={0}
                      dur={sm(2.8)}
                      repeatCount="indefinite"
                    />
                  </path>
                )}
                {mode === 'pulses' &&
                  tlG.dots.map((m, i) => (
                    <circle
                      key={`tlp-${i}`}
                      cx={m.x}
                      cy={tlG.lineY}
                      r={0}
                      fill="none"
                      stroke={accent}
                      strokeWidth={variant === 'canvas' ? 2 : 1.5}
                      opacity={0}
                    >
                      <animate
                        attributeName="r"
                        values={`0;${variant === 'canvas' ? 16 : 9}`}
                        dur={sm(2.6)}
                        begin={`${i * 0.3}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.7;0"
                        dur={sm(2.6)}
                        begin={`${i * 0.3}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                {mode === 'arrows' &&
                  [0, 1.1].map((off) => (
                    <path
                      key={`tla-${off}`}
                      d={`M ${-5 * s},${-3 * s} L ${5 * s},0 L ${-5 * s},${3 * s} Z`}
                      fill={accent}
                    >
                      <animateMotion
                        dur={sm(2.4)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                        path={tlG.linePath}
                      />
                    </path>
                  ))}
              </g>
            );
          })()}

        {/* iceberg: water, berg silhouettes, waterline + mode accents */}
        {bergG &&
          (() => {
            const dotR = variant === 'canvas' ? 4.5 : 3;
            const s = variant === 'canvas' ? 1.6 : 1;
            return (
              <g>
                <rect
                  x={0}
                  y={bergG.waterY}
                  width={dims.W}
                  height={dims.H - bergG.waterY}
                  fill="#38bdf8"
                  fillOpacity={0.06}
                />
                <polygon
                  points={bergG.belowBerg}
                  fill={accent}
                  fillOpacity={0.1}
                  stroke={accent}
                  strokeOpacity={0.18}
                  strokeWidth={1}
                />
                <polygon
                  points={bergG.aboveBerg}
                  fill="rgba(15,42,62,0.05)"
                  stroke="rgba(15,42,62,0.16)"
                  strokeWidth={1}
                />
                <path
                  d={bergG.wavePath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeOpacity={0.55}
                  strokeWidth={variant === 'canvas' ? 2 : 1.4}
                  strokeLinecap="round"
                />
                {mode === 'dots' &&
                  bergG.bubbleRails.map((r, i) => (
                    <circle key={`bgd-${i}`} r={dotR} fill={accent}>
                      <animateMotion
                        dur={sm(3.4)}
                        begin={`${i * 0.7}s`}
                        repeatCount="indefinite"
                        path={r}
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.9;0"
                        dur={sm(3.4)}
                        begin={`${i * 0.7}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                {mode === 'beams' && (
                  <path
                    d={bergG.wavePath}
                    pathLength={100}
                    stroke={`url(#${gradId}-glow)`}
                    strokeWidth={variant === 'canvas' ? 4 : 3}
                    strokeLinecap="round"
                    strokeDasharray="30 70"
                    fill="none"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from={100}
                      to={0}
                      dur={sm(3)}
                      repeatCount="indefinite"
                    />
                  </path>
                )}
                {mode === 'pulses' &&
                  [0, 1.5].map((off) => (
                    <circle
                      key={`bgp-${off}`}
                      cx={dims.W / 2}
                      cy={bergG.waterY}
                      r={0}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth={variant === 'canvas' ? 2 : 1.5}
                      opacity={0}
                    >
                      <animate
                        attributeName="r"
                        values={`6;${dims.W * 0.12}`}
                        dur={sm(3)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.55;0"
                        dur={sm(3)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                {mode === 'arrows' &&
                  bergG.bubbleRails.map((r, i) => (
                    <path
                      key={`bga-${i}`}
                      d={`M ${-5 * s},${-3 * s} L ${5 * s},0 L ${-5 * s},${3 * s} Z`}
                      fill={accent}
                    >
                      <animateMotion
                        dur={sm(3.4)}
                        begin={`${i * 0.7}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                        path={r}
                      />
                    </path>
                  ))}
              </g>
            );
          })()}

        {/* bars: static bar chart + looping mode accents */}
        {barsG &&
          (() => {
            const dotR = variant === 'canvas' ? 5 : 3.2;
            const s = variant === 'canvas' ? 1.8 : 1;
            const structW = variant === 'canvas' ? 1.6 : 1.1;
            return (
              <g>
                {barsG.gridYs.map((gy, i) => (
                  <path
                    key={`bgrid-${i}`}
                    d={`M ${barsG.plotL} ${gy} L ${barsG.plotR} ${gy}`}
                    fill="none"
                    stroke="rgba(15,42,62,0.08)"
                    strokeWidth={structW * 0.8}
                    strokeDasharray={variant === 'canvas' ? '5 7' : '3 4'}
                  />
                ))}
                {barsG.bars.map((b, i) => (
                  <rect
                    key={`bar-${i}`}
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    rx={barsG.rx}
                    fill={b.color}
                    fillOpacity={0.9}
                  >
                    {mode === 'pulses' && (
                      <animate
                        attributeName="fill-opacity"
                        values="0.9;0.55;0.9"
                        dur={sm(2.6)}
                        begin={`${i * 0.28}s`}
                        repeatCount="indefinite"
                      />
                    )}
                  </rect>
                ))}
                <path
                  d={barsG.baseline}
                  fill="none"
                  stroke="rgba(15,42,62,0.3)"
                  strokeWidth={structW * 1.2}
                  strokeLinecap="round"
                />
                {barsG.valueLabels.map((v, i) => (
                  <text
                    key={`bval-${i}`}
                    x={v.x}
                    y={v.y}
                    textAnchor="middle"
                    fontSize={barsG.valSize}
                    fontWeight={700}
                    fill="rgba(15,42,62,0.8)"
                    stroke="#ffffff"
                    strokeWidth={3}
                    paintOrder="stroke"
                    fontFamily={CHART_FONT}
                  >
                    {v.text}
                    {mode === 'pulses' && (
                      <animate
                        attributeName="y"
                        values={`${v.y};${v.y - 3};${v.y}`}
                        dur={sm(2.6)}
                        begin={`${i * 0.28}s`}
                        repeatCount="indefinite"
                      />
                    )}
                  </text>
                ))}
                {mode === 'beams' &&
                  barsG.spines.map((sp, i) => (
                    <path
                      key={`bbeam-${i}`}
                      d={sp}
                      pathLength={100}
                      stroke={`url(#${gradId}-glow)`}
                      strokeWidth={variant === 'canvas' ? 5 : 3.5}
                      strokeLinecap="round"
                      strokeDasharray="40 60"
                      fill="none"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from={100}
                        to={0}
                        dur={sm(2.4)}
                        begin={`${i * 0.35}s`}
                        repeatCount="indefinite"
                      />
                    </path>
                  ))}
                {mode === 'dots' &&
                  [0, 0.9, 1.8].map((off) => (
                    <circle key={`bdot-${off}`} r={dotR} fill={accent}>
                      <animateMotion
                        dur={sm(2.8)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                        path={barsG.baseline}
                      />
                    </circle>
                  ))}
                {mode === 'arrows' &&
                  [0, 1.5].map((off) => (
                    <path
                      key={`barr-${off}`}
                      d={`M ${-5 * s},${-3 * s} L ${5 * s},0 L ${-5 * s},${3 * s} Z`}
                      fill={accent}
                    >
                      <animateMotion
                        dur={sm(3)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                        path={barsG.topPath}
                      />
                    </path>
                  ))}
              </g>
            );
          })()}

        {/* chart-line: static area + curve + looping mode accents */}
        {lineG &&
          (() => {
            const dotR = variant === 'canvas' ? 5 : 3.2;
            const s = variant === 'canvas' ? 1.8 : 1;
            const structW = variant === 'canvas' ? 1.6 : 1.1;
            const curveW = variant === 'canvas' ? 3.5 : 2.2;
            const ptR = variant === 'canvas' ? 5.5 : 3.6;
            return (
              <g>
                {lineG.gridYs.map((gy, i) => (
                  <path
                    key={`lgrid-${i}`}
                    d={`M ${lineG.plotL} ${gy} L ${lineG.plotR} ${gy}`}
                    fill="none"
                    stroke="rgba(15,42,62,0.08)"
                    strokeWidth={structW * 0.8}
                    strokeDasharray={variant === 'canvas' ? '5 7' : '3 4'}
                  />
                ))}
                <path d={lineG.areaPath} fill={`url(#${gradId}-areafill)`} />
                <path
                  d={lineG.linePath}
                  fill="none"
                  stroke={accent}
                  strokeWidth={curveW}
                  strokeLinecap="round"
                />
                <path
                  d={lineG.baseline}
                  fill="none"
                  stroke="rgba(15,42,62,0.3)"
                  strokeWidth={structW * 1.2}
                  strokeLinecap="round"
                />
                {lineG.points.map((p, i) => (
                  <circle
                    key={`lpt-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={ptR}
                    fill="#ffffff"
                    stroke={accent}
                    strokeWidth={variant === 'canvas' ? 2.5 : 1.8}
                  />
                ))}
                {lineG.valueLabels.map((v, i) => (
                  <text
                    key={`lval-${i}`}
                    x={v.x}
                    y={v.y}
                    textAnchor="middle"
                    fontSize={lineG.valSize}
                    fontWeight={700}
                    fill="rgba(15,42,62,0.8)"
                    stroke="#ffffff"
                    strokeWidth={3}
                    paintOrder="stroke"
                    fontFamily={CHART_FONT}
                  >
                    {v.text}
                  </text>
                ))}
                {mode === 'beams' && (
                  <path
                    d={lineG.linePath}
                    pathLength={100}
                    stroke={`url(#${gradId}-glow)`}
                    strokeWidth={curveW * 2}
                    strokeLinecap="round"
                    strokeDasharray="30 70"
                    fill="none"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from={100}
                      to={0}
                      dur={sm(3)}
                      repeatCount="indefinite"
                    />
                  </path>
                )}
                {mode === 'dots' &&
                  [0, 1, 2].map((off) => (
                    <circle key={`ldot-${off}`} r={dotR} fill={accent}>
                      <animateMotion
                        dur={sm(3)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                        path={lineG.linePath}
                      />
                    </circle>
                  ))}
                {mode === 'pulses' &&
                  lineG.points.map((p, i) => (
                    <circle
                      key={`lpu-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r={0}
                      fill="none"
                      stroke={accent}
                      strokeWidth={variant === 'canvas' ? 2 : 1.5}
                      opacity={0}
                    >
                      <animate
                        attributeName="r"
                        values={`${ptR};${ptR * (variant === 'canvas' ? 3.2 : 2.6)}`}
                        dur={sm(2.6)}
                        begin={`${i * 0.3}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.7;0"
                        dur={sm(2.6)}
                        begin={`${i * 0.3}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
                {mode === 'arrows' &&
                  [0, 1.4].map((off) => (
                    <path
                      key={`larr-${off}`}
                      d={`M ${-5 * s},${-3 * s} L ${5 * s},0 L ${-5 * s},${3 * s} Z`}
                      fill={accent}
                    >
                      <animateMotion
                        dur={sm(2.8)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                        path={lineG.linePath}
                      />
                    </path>
                  ))}
              </g>
            );
          })()}

        {/* donut: static ring segments + looping mode accents */}
        {donutG &&
          (() => {
            const dotR = variant === 'canvas' ? 5 : 3.2;
            const s = variant === 'canvas' ? 1.8 : 1;
            return (
              <g>
                {donutG.segments.map((seg, i) => (
                  <path
                    key={`dseg-${i}`}
                    d={seg.path}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={donutG.thickness}
                    strokeLinecap="butt"
                  >
                    {mode === 'pulses' && (
                      <animate
                        attributeName="stroke-width"
                        values={`${donutG.thickness};${donutG.thickness * 1.22};${donutG.thickness}`}
                        dur={sm(2.8)}
                        begin={`${i * 0.35}s`}
                        repeatCount="indefinite"
                      />
                    )}
                  </path>
                ))}
                {donutG.shareLabels.map((v, i) => (
                  <text
                    key={`dval-${i}`}
                    x={v.x}
                    y={v.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={donutG.valSize}
                    fontWeight={700}
                    fill="#ffffff"
                    fontFamily={CHART_FONT}
                  >
                    {v.text}
                  </text>
                ))}
                {mode === 'beams' && (
                  <circle
                    cx={donutG.cx}
                    cy={donutG.cy}
                    r={donutG.r}
                    pathLength={100}
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity={0.5}
                    strokeWidth={donutG.thickness * 0.5}
                    strokeLinecap="round"
                    strokeDasharray="18 82"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from={0}
                      to={-100}
                      dur={sm(3.2)}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {mode === 'dots' &&
                  [0, 1.6].map((off) => (
                    <circle
                      key={`ddot-${off}`}
                      r={dotR}
                      fill="#ffffff"
                      stroke={accent}
                      strokeWidth={1.5}
                    >
                      <animateMotion
                        dur={sm(3.2)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                        path={donutG.ringPath}
                      />
                    </circle>
                  ))}
                {mode === 'pulses' && (
                  <circle
                    cx={donutG.cx}
                    cy={donutG.cy}
                    r={0}
                    fill="none"
                    stroke={accent}
                    strokeWidth={variant === 'canvas' ? 2 : 1.5}
                    opacity={0}
                  >
                    <animate
                      attributeName="r"
                      values={`${dims.tileLarge * 0.6};${donutG.r - donutG.thickness * 0.7}`}
                      dur={sm(2.8)}
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.45;0"
                      dur={sm(2.8)}
                      begin="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {mode === 'arrows' &&
                  [0, 1.6].map((off) => (
                    <path
                      key={`darr-${off}`}
                      d={`M ${-5 * s},${-3 * s} L ${5 * s},0 L ${-5 * s},${3 * s} Z`}
                      fill={accent}
                    >
                      <animateMotion
                        dur={sm(3.2)}
                        begin={`${off}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                        path={donutG.ringPath}
                      />
                    </path>
                  ))}
              </g>
            );
          })()}
      </svg>

      <div
        className="absolute inset-0"
        onPointerMove={editable ? moveDrag : undefined}
        onPointerUp={editable ? endDrag : undefined}
        onPointerCancel={editable ? endDrag : undefined}
        onPointerDown={
          editable && onSelect
            ? (e) => {
                if (e.target !== e.currentTarget) return; // a tile handles itself
                // Orbit satellites live in the SVG *under* this overlay, so
                // hit-test them at their CURRENT revolved position (from the
                // SVG's SMIL clock) before treating the click as empty canvas.
                if (orbit) {
                  const t = svgRef.current?.getCurrentTime?.() ?? 0;
                  const p = toSvg(e.clientX, e.clientY);
                  for (const ring of orbit.rings) {
                    for (let i = 0; i < ring.sats.length; i++) {
                      const pos = orbitSatPosition(orbit, ring, i, t, speed);
                      const hit = ring.size / 2 + 4;
                      if (
                        Math.abs(p.x - pos.x) <= hit &&
                        Math.abs(p.y - pos.y) <= hit
                      ) {
                        onSelect(ring.sats[i].key);
                        return;
                      }
                    }
                  }
                }
                // Iso cubes live in the SVG under this overlay — hit-test
                // their (static) boxes, topmost first: logo cube, then cubes
                // in reverse painter order so overlaps pick the front one.
                if (isoG && spec.layout === 'iso-steps') {
                  const p = toSvg(e.clientX, e.clientY);
                  const s = isoG.s;
                  const inCube = (x: number, y: number) =>
                    p.x >= x &&
                    p.x <= x + 1.732 * s &&
                    p.y >= y - 1.5 * s &&
                    p.y <= y + 0.5 * s;
                  if (inCube(isoG.logo.x, isoG.logo.y)) {
                    onSelect(spec.center.key);
                    return;
                  }
                  for (let i = isoG.cubes.length - 1; i >= 0; i--) {
                    const c = isoG.cubes[i];
                    if (inCube(c.x, c.y)) {
                      onSelect(c.key);
                      return;
                    }
                  }
                }
                // Clicking the empty canvas (not a tile) clears selection.
                onSelect(null);
              }
            : undefined
        }
      >
        {tiles.map((t) => (
          <Tile
            key={t.key}
            tile={t}
            dims={dims}
            variant={variant}
            editable={editable}
            selected={selectedKey === t.key}
            onSelect={onSelect}
            label={labelOverrides[t.key] ?? t.label}
            onLabelChange={onLabelChange}
            onPointerDown={beginDrag(t.key)}
          />
        ))}
      </div>

      {/* iso-steps heading — the center's label as the big text beside the
          stack (reference style: dark first half, accent second half). Static
          HTML layer, so PNG/GIF/MP4 exports all include it. */}
      {spec.layout === 'iso-steps' &&
        isoG?.headingLeft != null &&
        (() => {
          const raw = labelOverrides[spec.center.key] ?? spec.center.label;
          if (!raw) return null;
          const words = raw.split(/\s+/);
          const mid = Math.max(1, Math.ceil(words.length / 2));
          const line1 = words.slice(0, mid).join(' ');
          const line2 = words.slice(mid).join(' ');
          return (
            <div
              className="absolute select-none"
              style={{
                left: `${(isoG.headingLeft / dims.W) * 100}%`,
                right: '4%',
                top: '50%',
                transform: 'translateY(-50%)',
                lineHeight: 1.08,
                fontFamily: CHART_FONT,
                cursor: editable ? 'pointer' : undefined,
              }}
              onPointerDown={
                editable && onSelect
                  ? (e) => {
                      e.stopPropagation();
                      onSelect(spec.center.key);
                    }
                  : undefined
              }
            >
              <div
                style={{
                  fontSize: dims.W * 0.052,
                  fontWeight: 800,
                  color: '#232A35',
                  letterSpacing: '-0.02em',
                }}
              >
                {line1}
              </div>
              {line2 ? (
                <div
                  style={{
                    fontSize: dims.W * 0.037,
                    fontWeight: 800,
                    color: accent,
                    letterSpacing: '-0.01em',
                    marginTop: dims.W * 0.006,
                  }}
                >
                  {line2}
                </div>
              ) : null}
            </div>
          );
        })()}

      {showModeChip ? (
        <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-white/85 backdrop-blur border border-border px-2 py-0.5 text-[10px] font-medium tracking-wide text-foreground/70 shadow-sm">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent }}
          />
          {mode}
        </span>
      ) : null}
    </div>
  );
}

function Tile({
  tile,
  dims,
  variant,
  editable,
  selected,
  onSelect,
  label,
  onLabelChange,
  onPointerDown,
}: {
  tile: PositionedTile;
  dims: Dims;
  variant: 'home' | 'canvas';
  editable: boolean;
  selected: boolean;
  onSelect?: (key: string | null) => void;
  label?: string;
  onLabelChange?: (key: string, label: string) => void;
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
}) {
  const leftPct = (tile.x / dims.W) * 100;
  const topPct = (tile.y / dims.H) * 100;
  const padding = variant === 'canvas' ? 22 : 16;
  const flush = !!tile.flush;
  // Flush "3D" icons run edge-to-edge — give them a touch more presence than a
  // bordered tile of the same node size.
  const tilePx = tile.size + (flush ? padding * 1.25 : padding);
  const iconPadding = flush ? 0 : Math.round(tilePx * 0.22);
  const iconPx = tilePx - iconPadding * 2;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label || '');
  useEffect(() => setDraft(label || ''), [label]);

  const commit = () => {
    if (onLabelChange && draft !== label) onLabelChange(tile.key, draft);
    setEditing(false);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit();
    else if (e.key === 'Escape') {
      setDraft(label || '');
      setEditing(false);
    }
  };

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
    >
      <div
        onPointerDown={(e) => {
          if (editable && onSelect) {
            // Select this tile and keep the click from bubbling to the
            // background deselect handler.
            e.stopPropagation();
            onSelect(tile.key);
          }
          onPointerDown(e);
        }}
        className={
          'flex items-center justify-center ' +
          (editable ? 'cursor-grab active:cursor-grabbing ' : '') +
          (flush
            ? ''
            : 'rounded-2xl border ' +
              (tile.center
                ? 'bg-foreground text-background border-foreground shadow-[0_12px_28px_-8px_rgba(0,0,0,0.3)]'
                : 'bg-white border-border/80 shadow-[0_6px_16px_-6px_rgba(15,42,62,0.18)]'))
        }
        style={{
          width: tilePx,
          height: tilePx,
          touchAction: 'none',
          filter: flush
            ? 'drop-shadow(0 8px 16px rgba(15,42,62,0.22))'
            : undefined,
          outline: selected ? `2px solid ${SELECTION_COLOR}` : undefined,
          outlineOffset: 3,
          borderRadius: flush ? 18 : undefined,
        }}
      >
        <div
          className="flex items-center justify-center pointer-events-none"
          style={{ width: iconPx, height: iconPx }}
        >
          {tile.icon}
        </div>
      </div>
      {variant === 'canvas' ? (
        editing ? (
          <input
            value={draft}
            // biome-ignore lint/a11y/noAutofocus: the inline label editor opens on demand and should take focus immediately
            autoFocus
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDraft(e.target.value)
            }
            onBlur={commit}
            onKeyDown={handleKey}
            className="mt-2 text-[13px] font-medium text-foreground/90 bg-white border border-border rounded px-1.5 py-0.5 outline-none focus:border-foreground/50 text-center min-w-20 max-w-44"
          />
        ) : (
          <button
            type="button"
            onClick={() => editable && setEditing(true)}
            className={
              'mt-2 text-[13px] font-medium text-foreground/75 whitespace-nowrap ' +
              (editable
                ? 'hover:text-foreground hover:underline cursor-text'
                : '')
            }
          >
            {label || ' '}
          </button>
        )
      ) : null}
    </div>
  );
}
