'use client';

// Turns a template's plain diagram data into a renderable `PreviewSpec` for the
// shared <AnimatedPreview>. Icons come from the shared registry so the homepage
// thumbnail, the /templates detail hero and the /canvas editor all render the
// SAME icons (real brand logos + 3D glyphs) for a given template. This is
// client-only because it produces React nodes; keep it out of catalog.ts so
// that stays server-safe.

import type {
  PreviewMode,
  PreviewSpec,
  TreeNode,
} from '@/components/blocks/infogiph-home/animated-preview';
import type { ReactNode } from 'react';
import { iconNode, resolveIcon } from './icon-registry';
import type { DiagramData, IconKey, Template } from './types';

/**
 * Map a catalog icon key to a renderable node via the shared registry.
 * Kept for back-compat with callers that only have a key (e.g. static thumbs).
 */
export function iconNodeFromKey(key: IconKey, white = false): ReactNode {
  return iconNode(key, undefined, white);
}

const hashCode = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
};

const HUB_LAYOUTS = ['radial', 'hub-lr', 'pipeline'] as const;
const MODES: PreviewMode[] = ['beams', 'dots', 'arrows', 'pulses'];

/**
 * Build an animated PreviewSpec from a template. If the template pins a `style`
 * (curated "key example" templates), that exact layout/mode/accent/bg is used;
 * otherwise it's deterministic per slug so the same template always renders the
 * same way (no layout shift between renders).
 */
export function derivePreviewSpec(
  template: Template,
  accent: string
): PreviewSpec {
  const seed = hashCode(template.slug);
  const data: DiagramData = template.data;
  const style = template.style;
  const acc = style?.accent || accent;
  const bg = style?.bg;

  // A 3D icon is flush; a brand logo at the center is also rendered flush so a
  // colored logo never sits low-contrast on the dark center tile.
  const centerFlush = (r: { flush: boolean; kind: string }) =>
    r.flush || r.kind === 'brand';

  // Tree diagrams keep their hierarchy.
  if ('layout' in data && data.layout === 'tree') {
    const root = data.root;
    const r = resolveIcon(root.icon, root.label, true);
    const children: TreeNode[] = (root.children || [])
      .slice(0, 4)
      .map((c, i) => {
        const ci = resolveIcon(c.icon, c.label);
        return {
          key: `c${i}`,
          label: c.label,
          icon: ci.node,
          flush: ci.flush,
          children: (c.children || []).slice(0, 3).map((g, j) => {
            const gi = resolveIcon(g.icon, g.label);
            return {
              key: `c${i}-${j}`,
              label: g.label,
              icon: gi.node,
              flush: gi.flush,
            };
          }),
        };
      });
    return {
      layout: 'tree',
      mode: style?.mode || 'pulses',
      accent: acc,
      bg,
      root: {
        key: 'root',
        label: root.label,
        icon: r.node,
        flush: centerFlush(r),
        children,
      },
    };
  }

  const hub = data as Extract<DiagramData, { center: unknown }>;
  const ci = resolveIcon(hub.center.icon, hub.center.label, true);
  const center = {
    key: 'center',
    label: hub.center.label,
    icon: ci.node,
    flush: centerFlush(ci),
  };
  const sats = hub.satellites.map((s, i) => {
    const si = resolveIcon(s.icon, s.label);
    return { key: `sat-${i}`, label: s.label, icon: si.node, flush: si.flush };
  });

  // `tree` from style is only valid with tree data (handled above); for hub
  // data, fall back to radial.
  const styleLayout =
    style?.layout && style.layout !== 'tree' ? style.layout : undefined;
  const layout = styleLayout || HUB_LAYOUTS[seed % HUB_LAYOUTS.length];
  const mode = style?.mode || MODES[seed % MODES.length];

  if (layout === 'hub-lr') {
    const mid = Math.ceil(sats.length / 2);
    return {
      layout: 'hub-lr',
      mode,
      accent: acc,
      bg,
      left: sats.slice(0, mid),
      right: sats.slice(mid),
      center,
    };
  }

  if (layout === 'pipeline') {
    const mid = Math.floor(sats.length / 2);
    const nodes = [...sats];
    nodes.splice(mid, 0, center);
    return {
      layout: 'pipeline',
      mode: style?.mode || 'arrows',
      accent: acc,
      bg,
      nodes,
    };
  }

  return { layout: 'radial', mode, accent: acc, bg, center, satellites: sats };
}
