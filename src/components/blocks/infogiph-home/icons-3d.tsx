'use client';

import type { ReactNode } from 'react';

// Glossy, gradient "3D" app-icon style glyphs. Each renders a rounded squircle
// with a vertical brand gradient, a top gloss highlight, a rim light, and a
// bold white glyph — the chunky depth reads clearly next to the flat company
// logos in the same diagram. Designed to fill its tile edge-to-edge (use the
// `flush` tile mode in AnimatedPreview) but also looks fine inside a white tile.
//
// Gradient ids are static per icon: a given icon always paints the same colors,
// so duplicate ids across repeated instances resolve harmlessly to the first.

interface Squircle3DProps {
  id: string;
  from: string;
  to: string;
  glyph: ReactNode;
  /** Render the glyph filled white instead of stroked. */
  fillGlyph?: boolean;
  /** Glyph scale relative to the tile (default 0.56). */
  glyphScale?: number;
}

function Squircle3D({
  id,
  from,
  to,
  glyph,
  fillGlyph = false,
  glyphScale = 0.56,
}: Squircle3DProps) {
  const s = glyphScale;
  // Center-scale the 24-space glyph: translate to center, scale, translate back.
  const t = `translate(12 12) scale(${s}) translate(-12 -12)`;
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <linearGradient id={`${id}_gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* base squircle */}
      <rect
        x="1.5"
        y="1.5"
        width="21"
        height="21"
        rx="6.6"
        fill={`url(#${id})`}
      />
      {/* top gloss */}
      <path
        d="M3 9 Q3 2.5 9 2.5 H15 Q21 2.5 21 9 V9.6 Q12 12.4 3 9.6 Z"
        fill={`url(#${id}_gloss)`}
      />
      {/* rim light */}
      <rect
        x="1.9"
        y="1.9"
        width="20.2"
        height="20.2"
        rx="6.3"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.28"
        strokeWidth="0.7"
      />
      <g
        transform={t}
        fill={fillGlyph ? '#fff' : 'none'}
        stroke={fillGlyph ? 'none' : '#fff'}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {glyph}
      </g>
    </svg>
  );
}

export function Cube3D() {
  return (
    <Squircle3D
      id="i3d_cube"
      from="#a78bfa"
      to="#6d28d9"
      glyph={
        <>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path d="M3.3 7 12 12l8.7-5" />
          <path d="M12 22V12" />
        </>
      }
    />
  );
}

export function Bot3D() {
  return (
    <Squircle3D
      id="i3d_bot"
      from="#818cf8"
      to="#4f46e5"
      glyph={
        <>
          <rect x="5" y="8" width="14" height="10" rx="2.5" />
          <path d="M12 5v3M9 2.5h6" />
          <path d="M5.5 12.5H4M20 12.5h-1.5" />
          <circle cx="9.5" cy="13" r="0.6" fill="#fff" stroke="none" />
          <circle cx="14.5" cy="13" r="0.6" fill="#fff" stroke="none" />
        </>
      }
    />
  );
}

export function Brain3D() {
  return (
    <Squircle3D
      id="i3d_brain"
      from="#f0abfc"
      to="#7c3aed"
      glyphScale={0.6}
      glyph={
        <>
          <path d="M12 5v14" />
          <path d="M9.5 5A2.5 2.5 0 0 0 7 7.5 2.4 2.4 0 0 0 5.5 12 2.4 2.4 0 0 0 7 16a2.4 2.4 0 0 0 2.5 2.3" />
          <path d="M14.5 5A2.5 2.5 0 0 1 17 7.5 2.4 2.4 0 0 1 18.5 12 2.4 2.4 0 0 1 17 16a2.4 2.4 0 0 1-2.5 2.3" />
        </>
      }
    />
  );
}

export function Spark3D() {
  return (
    <Squircle3D
      id="i3d_spark"
      from="#c084fc"
      to="#6d28d9"
      fillGlyph
      glyphScale={0.66}
      glyph={
        <>
          <path d="M12 3.5l1.7 4.6 4.6 1.7-4.6 1.7L12 16.1l-1.7-4.6L5.7 9.8l4.6-1.7z" />
          <path d="M18 14.5l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8z" />
        </>
      }
    />
  );
}

export function Rocket3D() {
  return (
    <Squircle3D
      id="i3d_rocket"
      from="#fb923c"
      to="#e11d48"
      glyphScale={0.62}
      glyph={
        <>
          <path d="M12 3c2.8 1.2 4.5 4 4.5 7.5 0 2-.7 3.8-1.5 5h-6c-.8-1.2-1.5-3-1.5-5C7.5 7 9.2 4.2 12 3z" />
          <circle cx="12" cy="9.5" r="1.4" />
          <path d="M9 16c-1 .6-1.7 1.7-1.8 3.4 1.6-.2 2.7-.8 3.3-1.7M15 16c1 .6 1.7 1.7 1.8 3.4-1.6-.2-2.7-.8-3.3-1.7" />
        </>
      }
    />
  );
}

export function Chart3D() {
  return (
    <Squircle3D
      id="i3d_chart"
      from="#5eead4"
      to="#0d9488"
      glyph={
        <>
          <path d="M5 5v14h14" />
          <path d="M8.5 16v-3.5M12 16V9M15.5 16v-5.5" />
        </>
      }
    />
  );
}

export function Database3D() {
  return (
    <Squircle3D
      id="i3d_db"
      from="#2dd4bf"
      to="#0f766e"
      glyph={
        <>
          <ellipse cx="12" cy="6.5" rx="6" ry="2.4" />
          <path d="M6 6.5v11c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4v-11" />
          <path d="M6 12c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4" />
        </>
      }
    />
  );
}

export function Cloud3D() {
  return (
    <Squircle3D
      id="i3d_cloud"
      from="#7dd3fc"
      to="#2563eb"
      glyphScale={0.62}
      glyph={
        <path d="M7.5 17.5A3.5 3.5 0 0 1 7 10.6 5 5 0 0 1 16.7 9.7 3.9 3.9 0 0 1 16.5 17.5z" />
      }
    />
  );
}

export function Shield3D() {
  return (
    <Squircle3D
      id="i3d_shield"
      from="#67e8f9"
      to="#0891b2"
      glyph={
        <>
          <path d="M12 4l6 2.2v4.3c0 4-2.6 6.7-6 7.9-3.4-1.2-6-3.9-6-7.9V6.2z" />
          <path d="M9.4 11.6l1.8 1.8 3.4-3.6" />
        </>
      }
    />
  );
}

export function Gear3D() {
  return (
    <Squircle3D
      id="i3d_gear"
      from="#cbd5e1"
      to="#475569"
      glyph={
        <>
          <circle cx="12" cy="12" r="2.7" />
          <path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6" />
        </>
      }
    />
  );
}

export function Bolt3D() {
  return (
    <Squircle3D
      id="i3d_bolt"
      from="#fcd34d"
      to="#f97316"
      fillGlyph
      glyphScale={0.6}
      glyph={<path d="M13.5 3 6 13h4.5l-1 8 8-11h-5z" />}
    />
  );
}

export function Globe3D() {
  return (
    <Squircle3D
      id="i3d_globe"
      from="#60a5fa"
      to="#1d4ed8"
      glyph={
        <>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M4.5 12h15" />
          <path d="M12 4.5c2 2 3 4.7 3 7.5s-1 5.5-3 7.5c-2-2-3-4.7-3-7.5s1-5.5 3-7.5z" />
        </>
      }
    />
  );
}

export function Layers3D() {
  return (
    <Squircle3D
      id="i3d_layers"
      from="#c4b5fd"
      to="#7c3aed"
      glyph={
        <>
          <path d="M12 4 4 8l8 4 8-4z" />
          <path d="M4 12l8 4 8-4" />
          <path d="M4 16l8 4 8-4" />
        </>
      }
    />
  );
}

export function Funnel3D() {
  return (
    <Squircle3D
      id="i3d_funnel"
      from="#f9a8d4"
      to="#db2777"
      glyph={<path d="M5 5h14l-5.2 6.4v6L10.2 20v-8.6z" />}
    />
  );
}

export function Heart3D() {
  return (
    <Squircle3D
      id="i3d_heart"
      from="#fda4af"
      to="#e11d48"
      fillGlyph
      glyphScale={0.6}
      glyph={
        <path d="M12 20.3 4.7 13a4.4 4.4 0 0 1 6.2-6.2l1.1 1.1 1.1-1.1A4.4 4.4 0 0 1 19.3 13z" />
      }
    />
  );
}

export function Dollar3D() {
  return (
    <Squircle3D
      id="i3d_dollar"
      from="#6ee7b7"
      to="#059669"
      glyph={
        <>
          <path d="M12 4v16" />
          <path d="M15.5 7.5c-.8-1-2.1-1.5-3.5-1.5-2.2 0-3.7 1.1-3.7 2.8 0 4 7.4 2.3 7.4 6.3 0 1.8-1.7 2.9-3.7 2.9-1.6 0-3-.6-3.8-1.7" />
        </>
      }
    />
  );
}

export function Megaphone3D() {
  return (
    <Squircle3D
      id="i3d_mega"
      from="#fb923c"
      to="#db2777"
      glyph={<path d="M5 10v4l3 .5 1.5 4.5h2l-1.2-4 8.2 2.5V7L9.5 9.5 5 10z" />}
    />
  );
}

export function Bag3D() {
  return (
    <Squircle3D
      id="i3d_bag"
      from="#fdba74"
      to="#ea580c"
      glyph={
        <>
          <path d="M6 8h12l-.9 11H6.9z" />
          <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
        </>
      }
    />
  );
}

export function Lock3D() {
  return (
    <Squircle3D
      id="i3d_lock"
      from="#67e8f9"
      to="#0e7490"
      glyph={
        <>
          <rect x="6.5" y="11" width="11" height="8" rx="1.8" />
          <path d="M9 11V8.5a3 3 0 0 1 6 0V11" />
        </>
      }
    />
  );
}

export function Users3D() {
  return (
    <Squircle3D
      id="i3d_users"
      from="#fdba74"
      to="#ea580c"
      glyph={
        <>
          <circle cx="9.5" cy="9" r="2.6" />
          <path d="M5 18a4.5 4.5 0 0 1 9 0" />
          <path d="M15.5 7.2a2.6 2.6 0 0 1 0 5" />
          <path d="M16 14.2A4.5 4.5 0 0 1 19 18" />
        </>
      }
    />
  );
}

export function Workflow3D() {
  return (
    <Squircle3D
      id="i3d_flow"
      from="#d8b4fe"
      to="#9333ea"
      glyph={
        <>
          <rect x="4.5" y="5" width="6" height="5" rx="1.4" />
          <rect x="13.5" y="14" width="6" height="5" rx="1.4" />
          <path d="M7.5 10v3a2 2 0 0 0 2 2h4" />
        </>
      }
    />
  );
}

export function Box3D() {
  return (
    <Squircle3D
      id="i3d_box"
      from="#fbbf24"
      to="#d97706"
      glyph={
        <>
          <path d="M3.5 8 12 4l8.5 4v8L12 20l-8.5-4z" />
          <path d="M3.5 8 12 12l8.5-4" />
          <path d="M12 12v8" />
        </>
      }
    />
  );
}

export function Truck3D() {
  return (
    <Squircle3D
      id="i3d_truck"
      from="#60a5fa"
      to="#2563eb"
      glyphScale={0.62}
      glyph={
        <>
          <rect x="2.5" y="7" width="10" height="8" rx="1" />
          <path d="M12.5 10h4l3.5 3v2h-7.5z" />
          <circle cx="7" cy="17.5" r="1.7" />
          <circle cx="16.5" cy="17.5" r="1.7" />
        </>
      }
    />
  );
}

export function Factory3D() {
  return (
    <Squircle3D
      id="i3d_factory"
      from="#94a3b8"
      to="#475569"
      glyph={
        <>
          <path d="M3 20V10l5 3.2V10l5 3.2V8l6 3.6V20z" />
          <path d="M3 20h16" />
        </>
      }
    />
  );
}

export function Store3D() {
  return (
    <Squircle3D
      id="i3d_store"
      from="#f9a8d4"
      to="#db2777"
      glyph={
        <>
          <path d="M4 9l1.2-4h13.6L20 9" />
          <path d="M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
          <path d="M5 9.5V20h14V9.5" />
          <path d="M10 20v-5h4v5" />
        </>
      }
    />
  );
}

export function Terminal3D() {
  return (
    <Squircle3D
      id="i3d_terminal"
      from="#475569"
      to="#0f172a"
      glyph={
        <>
          <path d="M5.5 8.5 9.5 12l-4 3.5" />
          <path d="M11.5 15.5H18" />
        </>
      }
    />
  );
}

export function Cpu3D() {
  return (
    <Squircle3D
      id="i3d_cpu"
      from="#a78bfa"
      to="#6d28d9"
      glyphScale={0.7}
      glyph={
        <>
          <rect x="7" y="7" width="10" height="10" rx="1.4" />
          <rect x="10" y="10" width="4" height="4" rx="0.6" />
          <path d="M9.5 4v2.5M14.5 4v2.5M9.5 17.5V20M14.5 17.5V20M4 9.5h2.5M4 14.5h2.5M17.5 9.5H20M17.5 14.5H20" />
        </>
      }
    />
  );
}
