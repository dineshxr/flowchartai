'use client';

// Turns a template's plain diagram data into a renderable `PreviewSpec` for the
// shared <AnimatedPreview>. This is client-only because it produces React nodes
// (lucide icons); keep it out of catalog.ts so that stays server-safe.

import type {
  PreviewMode,
  PreviewSpec,
  TreeNode,
} from '@/components/blocks/infogiph-home/animated-preview';
import {
  Bot,
  Cloud,
  Database,
  Globe,
  HardDrive,
  Layers,
  Mail,
  MessageSquare,
  Search,
  Share2,
  Smartphone,
  Workflow,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { DiagramData, IconKey, Template } from './types';

/** Map a catalog icon key to a lucide React node. Mirrors getIcon() in the canvas. */
export function iconNodeFromKey(key: IconKey, white = false): ReactNode {
  const cls = white ? 'w-full h-full text-white' : 'w-full h-full';
  switch (key) {
    case 'bot':
      return <Bot className={cls} />;
    case 'database':
      return <Database className={cls} />;
    case 'cloud':
      return <Cloud className={cls} />;
    case 'web':
      return <Globe className={cls} />;
    case 'chat':
      return <MessageSquare className={cls} />;
    case 'drive':
      return <HardDrive className={cls} />;
    case 'mobile':
      return <Smartphone className={cls} />;
    case 'mail':
      return <Mail className={cls} />;
    case 'search':
      return <Search className={cls} />;
    case 'process':
      return <Workflow className={cls} />;
    case 'automation':
      return <Zap className={cls} />;
    case 'social':
      return <Share2 className={cls} />;
    default:
      return <Layers className={cls} />;
  }
}

const hashCode = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
};

const HUB_LAYOUTS = ['radial', 'hub-lr', 'pipeline'] as const;
const MODES: PreviewMode[] = ['beams', 'dots', 'arrows', 'pulses'];

/**
 * Build an animated PreviewSpec from a template. Deterministic per slug so the
 * same template always renders the same way (no layout shift between renders).
 */
export function derivePreviewSpec(
  template: Template,
  accent: string
): PreviewSpec {
  const seed = hashCode(template.slug);
  const data: DiagramData = template.data;

  // Tree diagrams keep their hierarchy.
  if ('layout' in data && data.layout === 'tree') {
    const root = data.root;
    const children: TreeNode[] = (root.children || [])
      .slice(0, 4)
      .map((c, i) => ({
        key: `c${i}`,
        label: c.label,
        icon: iconNodeFromKey(c.icon),
        children: (c.children || []).slice(0, 3).map((g, j) => ({
          key: `c${i}-${j}`,
          label: g.label,
          icon: iconNodeFromKey(g.icon),
        })),
      }));
    return {
      layout: 'tree',
      mode: 'pulses',
      accent,
      root: {
        key: 'root',
        label: root.label,
        icon: iconNodeFromKey(root.icon, true),
        children,
      },
    };
  }

  const hub = data as Extract<DiagramData, { center: unknown }>;
  const center = {
    key: 'center',
    label: hub.center.label,
    icon: iconNodeFromKey(hub.center.icon, true),
  };
  const sats = hub.satellites.map((s, i) => ({
    key: `sat-${i}`,
    label: s.label,
    icon: iconNodeFromKey(s.icon),
  }));

  const layout = HUB_LAYOUTS[seed % HUB_LAYOUTS.length];
  const mode = MODES[seed % MODES.length];

  if (layout === 'hub-lr') {
    const mid = Math.ceil(sats.length / 2);
    return {
      layout: 'hub-lr',
      mode,
      accent,
      left: sats.slice(0, mid),
      right: sats.slice(mid),
      center,
    };
  }

  if (layout === 'pipeline') {
    const mid = Math.floor(sats.length / 2);
    const nodes = [...sats];
    nodes.splice(mid, 0, center);
    return { layout: 'pipeline', mode: 'arrows', accent, nodes };
  }

  return { layout: 'radial', mode, accent, center, satellites: sats };
}
