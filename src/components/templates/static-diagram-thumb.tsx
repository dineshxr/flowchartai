'use client';

// A lightweight, non-animated SVG/HTML thumbnail of a template's diagram.
// Used in catalog grids where many cards render at once — cheap to paint and
// fully server-rendered for SEO. The animated version lives on detail pages.

import { iconNodeFromKey } from '@/lib/templates/preview';
import type { DiagramData } from '@/lib/templates/types';

const W = 240;
const H = 320;

interface Tile {
  key: string;
  x: number;
  y: number;
  size: number;
  center?: boolean;
  icon: React.ReactNode;
}

interface Edge {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function computeLayout(data: DiagramData): { tiles: Tile[]; edges: Edge[] } {
  const tiles: Tile[] = [];
  const edges: Edge[] = [];

  if ('layout' in data && data.layout === 'tree') {
    const root = data.root;
    const rootX = W / 2;
    const rootY = 52;
    tiles.push({
      key: 'root',
      x: rootX,
      y: rootY,
      size: 56,
      center: true,
      icon: iconNodeFromKey(root.icon, true),
    });
    const level1 = (root.children || []).slice(0, 4);
    const l1Y = 176;
    const l1Gap = W / (level1.length + 1);
    level1.forEach((child, i) => {
      const x = l1Gap * (i + 1);
      edges.push({ key: `e1-${i}`, x1: rootX, y1: rootY, x2: x, y2: l1Y });
      tiles.push({
        key: `c${i}`,
        x,
        y: l1Y,
        size: 42,
        icon: iconNodeFromKey(child.icon),
      });
      const l2 = (child.children || []).slice(0, 3);
      if (l2.length) {
        const l2Y = 276;
        const gap = 40;
        const startX = x - ((l2.length - 1) * gap) / 2;
        l2.forEach((gc, j) => {
          const gx = Math.max(22, Math.min(W - 22, startX + gap * j));
          edges.push({ key: `e2-${i}-${j}`, x1: x, y1: l1Y, x2: gx, y2: l2Y });
          tiles.push({
            key: `c${i}-${j}`,
            x: gx,
            y: l2Y,
            size: 34,
            icon: iconNodeFromKey(gc.icon),
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
    edges.push({ key: `e-${i}`, x1: cx, y1: cy, x2: x, y2: y });
    tiles.push({
      key: `sat-${i}`,
      x,
      y,
      size: 42,
      icon: iconNodeFromKey(sat.icon),
    });
  });
  tiles.push({
    key: 'center',
    x: cx,
    y: cy,
    size: 60,
    center: true,
    icon: iconNodeFromKey(hub.center.icon, true),
  });
  return { tiles, edges };
}

export function StaticDiagramThumb({
  data,
  accent = '#8b5cf6',
}: {
  data: DiagramData;
  accent?: string;
}) {
  const { tiles, edges } = computeLayout(data);

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
      </svg>
      {tiles.map((t) => {
        const leftPct = (t.x / W) * 100;
        const topPct = (t.y / H) * 100;
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
              background: t.center ? accent : 'white',
              border: t.center ? 'none' : '1px solid rgba(0,0,0,0.08)',
              boxShadow: t.center
                ? `0 6px 18px ${accent}55`
                : '0 1px 3px rgba(0,0,0,0.06)',
              color: t.center ? 'white' : '#475569',
            }}
          >
            <div
              style={{ width: t.size * 0.5, height: t.size * 0.5 }}
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
