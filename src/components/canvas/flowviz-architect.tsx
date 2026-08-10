'use client';

import { LoginWrapper } from '@/components/auth/login-wrapper';
import { SignInTakeover } from '@/components/auth/signin-takeover';
import {
  AnimatedPreview,
  type Dims,
  type PreviewMode,
  type PreviewNode,
  type PreviewSpec,
} from '@/components/blocks/infogiph-home/animated-preview';
import {
  CanvasComposer,
  type ComposerMode,
} from '@/components/canvas/canvas-composer';
import { ElementInspector } from '@/components/canvas/element-inspector';
import {
  EXPORT_FORMATS,
  ExportDialog,
  type ExportFormat,
} from '@/components/canvas/export-dialog';
import { ProcessingOverlay } from '@/components/canvas/processing-overlay';
import {
  type AppliedVisual,
  TextToVisualPanel,
} from '@/components/canvas/text-to-visual-panel';
import { UserButton } from '@/components/layout/user-button';
import { UpgradeDialog } from '@/components/pricing/upgrade-dialog';
import { AgentThinkingOrb } from '@/components/shared/thinking-orb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PLAN_BY_ID } from '@/config/plans';
import { useCurrentUserWithStatus } from '@/hooks/use-current-user';
import {
  EXPORT_PRESETS,
  type ExportPreset,
  useFlowchartExport,
} from '@/hooks/use-export';
import { useFlowchart } from '@/hooks/use-flowchart';
import { useUserPlan } from '@/hooks/use-user-plan';
import { useLocalePathname } from '@/i18n/navigation';
import { fetchSvglDataUrl, matchLogosForNodes } from '@/lib/svgl';
import {
  accentForCategory,
  allTemplates,
  getTemplateBySlug,
  templateTopicSeed,
} from '@/lib/templates/catalog';
import { resolveIcon, resolveSvgIcon } from '@/lib/templates/icon-registry';
import { derivePreviewSpec } from '@/lib/templates/preview';
import type { Template, TemplateLayout } from '@/lib/templates/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronLeft,
  CircleDot,
  Cloud,
  Database,
  Download,
  Edit,
  Globe,
  HardDrive,
  Layers,
  LayoutGrid,
  LineChart,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  Orbit,
  PanelLeftClose,
  PanelLeftOpen,
  Pipette,
  Search,
  Send,
  Share2,
  Smartphone,
  Sparkles,
  User,
  Users,
  Wand2,
  Workflow,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import {
  AlgoliaIcon,
  Auth0Icon,
  CloudflareIcon,
  DbtIcon,
  GitHubIcon,
  GoogleAnalyticsIcon,
  GoogleDriveIcon,
  InstagramIcon,
  LetterIcon,
  MailchimpIcon,
  NotionIcon,
  OpenAIIcon,
  PineconeIcon,
  PostgresIcon,
  RedisIcon,
  SalesforceIcon,
  ShopifyIcon,
  SlackIcon,
  SnowflakeIcon,
  StripeIcon,
  TableauIcon,
  TikTokIcon,
  UPSIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from './brand-icons';

// AI-generated diagrams resolve every node's icon (brand logo / 3D glyph /
// concept) through the shared registry, so they use the same rich icon set as
// the templates. See src/lib/templates/icon-registry.tsx.

// Rebuild a PreviewSpec from an AI result using the active template's layout
// so the output stays in the same animated-beam visual style the user picked.
const buildPreviewFromAI = (
  result: any,
  base: (typeof TEMPLATES)[number] | null
): PreviewSpec | null => {
  if (!result || !base) return null;
  const spec = base.preview;
  const centerLabel =
    result.center?.label || (spec as any).center?.label || base.label;
  // Resolve the center through the registry. A brand logo at the center is
  // rendered flush (edge-to-edge) so a colored logo never sits low-contrast on
  // the dark center tile.
  const c = resolveIcon(result.center?.icon, result.center?.label, true);
  const center = {
    key: 'center',
    label: centerLabel,
    icon: c.node,
    flush: c.flush || c.kind === 'brand',
  };
  const sats: any[] = result.satellites || [];
  const satNodes: PreviewNode[] = sats.map((s, i) => {
    const r = resolveIcon(s.icon, s.label);
    const sv = resolveSvgIcon(s.icon, s.label);
    return {
      key: `sat-${i}`,
      label: s.label,
      icon: r.node,
      flush: r.flush,
      svgIcon: sv.node,
      letter: sv.letter,
      tint: sv.tint,
    };
  });

  switch (spec.layout) {
    case 'hub-lr': {
      const mid = Math.ceil(satNodes.length / 2);
      return {
        layout: 'hub-lr',
        mode: spec.mode,
        accent: (spec as any).accent,
        bg: spec.bg,
        left: satNodes.slice(0, mid),
        right: satNodes.slice(mid),
        center,
      };
    }
    case 'radial':
      return {
        layout: 'radial',
        mode: spec.mode,
        accent: (spec as any).accent,
        bg: spec.bg,
        center,
        satellites: satNodes,
      };
    case 'orbit':
      return {
        layout: 'orbit',
        mode: spec.mode,
        accent: (spec as any).accent,
        bg: spec.bg,
        center,
        satellites: satNodes,
      };
    case 'cycle':
    case 'steps':
    case 'funnel':
    case 'pyramid':
    case 'quadrant':
    case 'columns':
    case 'timeline':
    case 'iceberg':
      return {
        layout: spec.layout,
        mode: spec.mode,
        accent: (spec as any).accent,
        bg: spec.bg,
        center,
        satellites: satNodes,
      } as PreviewSpec;
    case 'pipeline': {
      const mid = Math.floor(satNodes.length / 2);
      const nodes = [...satNodes];
      nodes.splice(mid, 0, center);
      return {
        layout: 'pipeline',
        mode: spec.mode,
        accent: (spec as any).accent,
        bg: spec.bg,
        nodes,
      };
    }
    case 'tree': {
      const children = satNodes.slice(0, 3).map((n, i) => ({
        ...n,
        children: i === 1 ? satNodes.slice(3, 5) : undefined,
      }));
      return {
        layout: 'tree',
        mode: spec.mode,
        accent: (spec as any).accent,
        bg: spec.bg,
        root: { ...center, children },
      };
    }
  }
};

// ---- In-canvas element editing ---------------------------------------------
// A node's icon can be swapped to another registry key, or replaced with an
// uploaded custom logo (an image URL).
type IconOverride =
  | { kind: 'key'; key: string }
  | { kind: 'image'; url: string };

const overrideIcon = (node: any, ov: IconOverride | undefined) => {
  if (!ov) return node;
  if (ov.kind === 'image') {
    return {
      ...node,
      icon: (
        <img src={ov.url} alt="" className="h-full w-full object-contain" />
      ),
      // Custom logos are stored as data: URLs, which survive the standalone
      // SVG serialization — so orbit satellites can carry them too.
      svgIcon: (
        <image
          href={ov.url}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        />
      ),
      flush: false,
    };
  }
  const isCenter = node.key === 'center';
  // Resolve the EXPLICIT picked key only — pass no label, so resolveIcon's
  // label→brand inference can't override the user's choice (e.g. picking the
  // "database" concept for a node still labelled "WhatsApp").
  const r = resolveIcon(ov.key, undefined, isCenter);
  const sv = resolveSvgIcon(ov.key, undefined);
  return {
    ...node,
    icon: r.node,
    flush: isCenter ? r.flush || r.kind === 'brand' : r.flush,
    svgIcon: sv.node,
    letter: sv.letter,
    tint: sv.tint,
  };
};

// Apply the user's element edits (deletions + icon swaps) to the spec before it
// renders. Node keys are stable (center, sat-N) so edits survive layout changes.
function applyElementEdits(
  spec: PreviewSpec | null,
  deleted: Set<string>,
  iconOverrides: Record<string, IconOverride>
): PreviewSpec | null {
  if (!spec) return spec;
  const keep = (n: any) => !deleted.has(n.key);
  const tn = (n: any) => overrideIcon(n, iconOverrides[n.key]);
  switch (spec.layout) {
    case 'hub-lr':
      return {
        ...spec,
        left: spec.left.filter(keep).map(tn),
        right: spec.right.filter(keep).map(tn),
        center: tn(spec.center),
      };
    case 'radial':
      return {
        ...spec,
        satellites: spec.satellites.filter(keep).map(tn),
        center: tn(spec.center),
      };
    case 'orbit':
      return {
        ...spec,
        satellites: spec.satellites.filter(keep).map(tn),
        center: tn(spec.center),
      };
    case 'cycle':
    case 'steps':
    case 'funnel':
    case 'pyramid':
    case 'timeline':
    case 'iceberg':
      return {
        ...spec,
        satellites: spec.satellites.filter(keep).map(tn),
        center: tn(spec.center),
      };
    case 'quadrant':
    case 'columns':
      return {
        ...spec,
        satellites: spec.satellites.filter(keep).map(tn),
        center: spec.center ? tn(spec.center) : undefined,
      };
    case 'pipeline':
      return { ...spec, nodes: spec.nodes.filter(keep).map(tn) };
    case 'tree': {
      const root = spec.root;
      const children = (root.children || []).filter(keep).map((c: any) => ({
        ...tn(c),
        children: (c.children || []).filter(keep).map(tn),
      }));
      return { ...spec, root: { ...tn(root), children } };
    }
  }
  return spec;
}

// Flatten the spec into a key -> { label, isCenter } index so the inspector can
// describe the selected node regardless of layout.
function indexSpecNodes(
  spec: PreviewSpec | null
): Record<string, { label: string; isCenter: boolean }> {
  const out: Record<string, { label: string; isCenter: boolean }> = {};
  if (!spec) return out;
  const add = (n: any, isCenter = false) => {
    if (n) out[n.key] = { label: n.label ?? '', isCenter };
  };
  switch (spec.layout) {
    case 'hub-lr':
      spec.left.forEach((n: any) => add(n));
      spec.right.forEach((n: any) => add(n));
      add(spec.center, true);
      break;
    case 'radial':
      spec.satellites.forEach((n: any) => add(n));
      add(spec.center, true);
      break;
    case 'orbit':
    case 'cycle':
    case 'steps':
    case 'funnel':
    case 'pyramid':
    case 'quadrant':
    case 'columns':
    case 'timeline':
    case 'iceberg':
      spec.satellites.forEach((n: any) => add(n));
      add(spec.center, true);
      break;
    case 'pipeline':
      spec.nodes.forEach((n: any) => add(n, n.key === 'center'));
      break;
    case 'tree':
      add(spec.root, true);
      (spec.root.children || []).forEach((c: any) => {
        add(c);
        (c.children || []).forEach((gc: any) => add(gc));
      });
      break;
  }
  return out;
}

// Auto-resolve real brand logos (svgl.app catalog, 665+ brands) for a spec's
// node labels. Confident label matches become image icon-overrides — the same
// mechanism as user-uploaded logos, so they render in the preview, survive
// export rasterization (data: URLs), and persist with the saved diagram.
// Labels without a match keep their registry resolution (brand/concept/letter).
async function autoLogoOverrides(
  spec: PreviewSpec | null
): Promise<Record<string, IconOverride>> {
  if (!spec) return {};
  const nodes = Object.entries(indexSpecNodes(spec)).map(([key, n]) => ({
    key,
    label: n.label,
  }));
  const logos = await matchLogosForNodes(nodes);
  return Object.fromEntries(
    Object.entries(logos).map(([key, url]) => [
      key,
      { kind: 'image', url } satisfies IconOverride,
    ])
  );
}

// Preset swatches for the connection-color picker (dots / beams / pulses /
// arrows all draw from the spec's single accent). Mirrors the accents used
// across the template catalog so picked colors feel native.
const ACCENT_PRESETS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#ff5b8a',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#10b981',
  '#14b8a6',
  '#0ea5e9',
  '#3b82f6',
  '#64748b',
];

// Build aspect-aware canvas dims from the measured frame so AnimatedPreview's
// layout recomputes for the current orientation. Without this it always lays
// nodes out on a landscape 960×540 grid and a portrait frame squishes them into
// an overlapping mess. Tile sizes + margins scale with the SHORTER side, so
// spacing stays generous and nothing overlaps at any aspect ratio.
function makeCanvasDims(w: number, h: number): Dims {
  const W = Math.max(w, 1);
  const H = Math.max(h, 1);
  const m = Math.min(W, H);
  const tileBase = Math.min(58, Math.max(36, m * 0.08));
  const tileLarge = tileBase * 1.5;
  return {
    W,
    H,
    tileBase,
    tileLarge,
    // Keep margins tight: roomier columns (so a node + its label don't collide
    // with the next node) and a wider horizontal spread away from the center.
    margin: Math.max(tileLarge * 0.95, m * 0.13),
    labelSize: Math.min(14, Math.max(11, m * 0.024)),
  };
}

// Horizontal layouts (hub-lr, pipeline) need width; in a portrait/narrow frame
// their three columns collide with the center. Re-arrange them as a radial
// burst, which fills any aspect cleanly. Node keys are preserved so drag
// position overrides still apply. Landscape/square keep their intended layout.
function adaptSpecToAspect(
  spec: PreviewSpec | null,
  dims: Dims | undefined
): PreviewSpec | null {
  if (!spec || !dims) return spec;
  const portrait = dims.H > dims.W * 1.1;

  if (spec.layout === 'hub-lr') {
    // hub-lr stacks satellites in two columns; that overlaps in portrait, and
    // also once a column holds 4+ nodes (their labels collide). Fall back to an
    // even radial burst in those cases.
    const total = spec.left.length + spec.right.length;
    if (!portrait && total <= 6) return spec;
    return {
      layout: 'radial',
      mode: spec.mode,
      accent: spec.accent,
      bg: spec.bg,
      center: spec.center,
      satellites: [...spec.left, ...spec.right],
    };
  }
  if (spec.layout === 'pipeline' && (portrait || spec.nodes.length > 6)) {
    const nodes = spec.nodes;
    const mid = Math.floor((nodes.length - 1) / 2);
    return {
      layout: 'radial',
      mode: spec.mode,
      accent: spec.accent,
      bg: spec.bg,
      center: nodes[mid],
      satellites: nodes.filter((_, i) => i !== mid),
    };
  }
  return spec;
}

const getIcon = (name: string, size = 24) => {
  if (!name) return <Layers size={size} />;
  const n = name.toLowerCase();
  if (n.includes('db') || n.includes('database') || n.includes('sql'))
    return <Database size={size} />;
  if (n.includes('cloud')) return <Cloud size={size} />;
  if (n.includes('web') || n.includes('globe') || n.includes('internet'))
    return <Globe size={size} />;
  if (
    n.includes('msg') ||
    n.includes('chat') ||
    n.includes('whatsapp') ||
    n.includes('messenger')
  )
    return <MessageSquare size={size} />;
  if (n.includes('ai') || n.includes('bot') || n.includes('gpt'))
    return <Bot size={size} />;
  if (n.includes('drive') || n.includes('storage'))
    return <HardDrive size={size} />;
  if (n.includes('mobile') || n.includes('app') || n.includes('phone'))
    return <Smartphone size={size} />;
  if (n.includes('mail') || n.includes('email')) return <Mail size={size} />;
  if (n.includes('search')) return <Search size={size} />;
  if (n.includes('process') || n.includes('logic'))
    return <Workflow size={size} />;
  if (n.includes('zapier') || n.includes('automation'))
    return <Zap size={size} />;
  if (n.includes('social') || n.includes('share'))
    return <Share2 size={size} />;
  return <Layers size={size} />;
};

const TEMPLATES: Array<{
  id: string;
  label: string;
  icon: React.ReactNode;
  topic: string;
  data: any;
  preview: PreviewSpec;
}> = [
  {
    id: 'chatbot',
    label: 'Chatbot Architecture',
    icon: <MessageSquare size={18} />,
    topic: 'Chatbot Architecture with NLP, Dialog Manager, and integrations',
    data: {
      center: { label: 'Chatbot', icon: 'bot' },
      satellites: [
        { label: 'NLP Engine', icon: 'ai' },
        { label: 'Knowledge Base', icon: 'database' },
        { label: 'WhatsApp', icon: 'chat' },
        { label: 'Web Widget', icon: 'web' },
        { label: 'Analytics', icon: 'search' },
        { label: 'CRM', icon: 'layers' },
      ],
    },
    preview: {
      layout: 'hub-lr',
      mode: 'beams',
      accent: '#8b5cf6',
      left: [
        {
          key: 'wa',
          label: 'WhatsApp',
          icon: (
            <WhatsAppIcon
              className="w-full h-full"
              style={{ color: '#25D366' }}
            />
          ),
        },
        {
          key: 'sl',
          label: 'Slack',
          icon: <SlackIcon className="w-full h-full" />,
        },
        {
          key: 'ig',
          label: 'Instagram',
          icon: (
            <InstagramIcon
              className="w-full h-full"
              style={{ color: '#E4405F' }}
            />
          ),
        },
      ],
      right: [
        {
          key: 'ai',
          label: 'OpenAI',
          icon: <OpenAIIcon className="w-full h-full" />,
        },
        {
          key: 'nt',
          label: 'Notion',
          icon: <NotionIcon className="w-full h-full" />,
        },
        {
          key: 'crm',
          label: 'Salesforce',
          icon: <SalesforceIcon className="w-full h-full" />,
        },
      ],
      center: {
        key: 'bot',
        label: 'Chatbot',
        icon: <Bot className="w-full h-full text-white" />,
      },
    },
  },
  {
    id: 'saas',
    label: 'SaaS Platform',
    icon: <Cloud size={18} />,
    topic: 'SaaS platform with auth, billing, and microservices',
    data: {
      center: { label: 'API Gateway', icon: 'cloud' },
      satellites: [
        { label: 'Auth Service', icon: 'process' },
        { label: 'User DB', icon: 'database' },
        { label: 'Billing', icon: 'zap' },
        { label: 'Dashboard', icon: 'web' },
        { label: 'Email', icon: 'email' },
        { label: 'Storage', icon: 'drive' },
      ],
    },
    preview: {
      layout: 'hub-lr',
      mode: 'dots',
      accent: '#0ea5e9',
      left: [
        {
          key: 'st',
          label: 'Stripe',
          icon: (
            <StripeIcon
              className="w-full h-full"
              style={{ color: '#635BFF' }}
            />
          ),
        },
        {
          key: 'a0',
          label: 'Auth0',
          icon: <Auth0Icon className="w-full h-full" />,
        },
        {
          key: 'pg',
          label: 'Postgres',
          icon: <PostgresIcon className="w-full h-full" />,
        },
      ],
      right: [
        {
          key: 'gd',
          label: 'Drive',
          icon: <GoogleDriveIcon className="w-full h-full" />,
        },
        {
          key: 'mail',
          label: 'Email',
          icon: <Mail className="w-full h-full text-[#EA4335]" />,
        },
        {
          key: 'gh',
          label: 'GitHub',
          icon: <GitHubIcon className="w-full h-full" />,
        },
      ],
      center: {
        key: 'cloud',
        label: 'API Gateway',
        icon: <Cloud className="w-full h-full text-white" />,
      },
    },
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce Flow',
    icon: <LayoutGrid size={18} />,
    topic: 'E-Commerce system with cart, payment, and fulfillment',
    data: {
      center: { label: 'Store', icon: 'web' },
      satellites: [
        { label: 'Product DB', icon: 'database' },
        { label: 'Cart Service', icon: 'process' },
        { label: 'Payments', icon: 'zap' },
        { label: 'Shipping', icon: 'share' },
        { label: 'Notifications', icon: 'email' },
        { label: 'Analytics', icon: 'search' },
      ],
    },
    preview: {
      layout: 'cycle',
      mode: 'arrows',
      accent: '#f97316',
      center: {
        key: 'shop',
        label: 'Store',
        icon: <LayoutGrid className="w-full h-full text-white" />,
      },
      satellites: [
        {
          key: 'sh',
          label: 'Shopify',
          icon: (
            <ShopifyIcon
              className="w-full h-full"
              style={{ color: '#95BF47' }}
            />
          ),
        },
        {
          key: 'st',
          label: 'Stripe',
          icon: (
            <StripeIcon
              className="w-full h-full"
              style={{ color: '#635BFF' }}
            />
          ),
        },
        {
          key: 'mc',
          label: 'Mailchimp',
          icon: <MailchimpIcon className="w-full h-full" />,
        },
        {
          key: 'up',
          label: 'UPS',
          icon: <UPSIcon className="w-full h-full" />,
        },
        {
          key: 'ga',
          label: 'Analytics',
          icon: <GoogleAnalyticsIcon className="w-full h-full" />,
        },
        {
          key: 'pg',
          label: 'Products',
          icon: <PostgresIcon className="w-full h-full" />,
        },
      ],
    },
  },
  {
    id: 'data-pipeline',
    label: 'Data Pipeline',
    icon: <Database size={18} />,
    topic: 'ETL data pipeline with ingestion, processing, and warehouse',
    data: {
      center: { label: 'Data Lake', icon: 'database' },
      satellites: [
        { label: 'Ingestion', icon: 'zap' },
        { label: 'Transform', icon: 'process' },
        { label: 'ML Models', icon: 'ai' },
        { label: 'Dashboard', icon: 'web' },
        { label: 'Alerts', icon: 'email' },
        { label: 'API', icon: 'cloud' },
      ],
    },
    preview: {
      layout: 'pipeline',
      mode: 'arrows',
      accent: '#14b8a6',
      nodes: [
        {
          key: 'sn',
          label: 'Snowflake',
          icon: <SnowflakeIcon className="w-full h-full" />,
        },
        {
          key: 'dbt',
          label: 'dbt',
          icon: <DbtIcon className="w-full h-full" />,
        },
        {
          key: 'db',
          label: 'Data Lake',
          icon: <Database className="w-full h-full text-white" />,
        },
        {
          key: 'ai',
          label: 'ML',
          icon: <OpenAIIcon className="w-full h-full" />,
        },
        {
          key: 'tab',
          label: 'Tableau',
          icon: <TableauIcon className="w-full h-full" />,
        },
      ],
    },
  },
  {
    id: 'social-media',
    label: 'Social Platform',
    icon: <Share2 size={18} />,
    topic: 'Social media platform architecture',
    data: {
      center: { label: 'Feed Engine', icon: 'social' },
      satellites: [
        { label: 'User Profiles', icon: 'database' },
        { label: 'Messaging', icon: 'chat' },
        { label: 'Media CDN', icon: 'cloud' },
        { label: 'Search', icon: 'search' },
        { label: 'Notifications', icon: 'email' },
        { label: 'Analytics', icon: 'search' },
      ],
    },
    preview: {
      layout: 'columns',
      mode: 'beams',
      accent: '#ec4899',
      satellites: [
        {
          key: 'ig',
          label: 'Instagram',
          icon: (
            <InstagramIcon
              className="w-full h-full"
              style={{ color: '#E4405F' }}
            />
          ),
        },
        {
          key: 'tt',
          label: 'TikTok',
          icon: <TikTokIcon className="w-full h-full" />,
        },
        {
          key: 'yt',
          label: 'YouTube',
          icon: (
            <YouTubeIcon
              className="w-full h-full"
              style={{ color: '#FF0000' }}
            />
          ),
        },
        {
          key: 'wa',
          label: 'Messaging',
          icon: (
            <WhatsAppIcon
              className="w-full h-full"
              style={{ color: '#25D366' }}
            />
          ),
        },
        {
          key: 'cdn',
          label: 'CDN',
          icon: <CloudflareIcon className="w-full h-full" />,
        },
        {
          key: 'alg',
          label: 'Search',
          icon: <AlgoliaIcon className="w-full h-full" />,
        },
      ],
      center: {
        key: 'feed',
        label: 'Feed Engine',
        icon: <Share2 className="w-full h-full text-white" />,
      },
    },
  },
  {
    id: 'ai-agent',
    label: 'AI Agent System',
    icon: <Sparkles size={18} />,
    topic: 'AI agent with tools, memory, and orchestration',
    data: {
      center: { label: 'AI Agent', icon: 'bot' },
      satellites: [
        { label: 'LLM', icon: 'ai' },
        { label: 'Vector DB', icon: 'database' },
        { label: 'Tools', icon: 'zap' },
        { label: 'Memory', icon: 'drive' },
        { label: 'Web Search', icon: 'search' },
        { label: 'API Calls', icon: 'cloud' },
      ],
    },
    preview: {
      layout: 'steps',
      mode: 'dots',
      accent: '#6366f1',
      center: {
        key: 'agent',
        label: 'AI Agent',
        icon: <Sparkles className="w-full h-full text-white" />,
      },
      satellites: [
        {
          key: 'ai',
          label: 'OpenAI',
          icon: <OpenAIIcon className="w-full h-full" />,
        },
        {
          key: 'pc',
          label: 'Pinecone',
          icon: <PineconeIcon className="w-full h-full" />,
        },
        {
          key: 'gh',
          label: 'GitHub',
          icon: <GitHubIcon className="w-full h-full" />,
        },
        {
          key: 'gd',
          label: 'Drive',
          icon: <GoogleDriveIcon className="w-full h-full" />,
        },
        {
          key: 'nt',
          label: 'Notion',
          icon: <NotionIcon className="w-full h-full" />,
        },
        {
          key: 'rd',
          label: 'Memory',
          icon: <RedisIcon className="w-full h-full" />,
        },
      ],
    },
  },
  {
    id: 'org-chart',
    label: 'Org Chart',
    icon: <Users size={18} />,
    topic: 'Company org chart with CEO, CTO, CMO, COO, and engineers',
    data: {
      layout: 'tree',
      root: {
        label: 'CEO',
        icon: 'process',
        tool: 'Claude',
        children: [
          { label: 'CMO', icon: 'social', tool: 'OpenClaw' },
          {
            label: 'CTO',
            icon: 'process',
            tool: 'Cursor',
            children: [
              {
                label: 'CodexCoder',
                icon: 'automation',
                role: 'Engineer',
                tool: 'Codex',
              },
              {
                label: 'ClaudeCoder',
                icon: 'automation',
                role: 'Engineer',
                tool: 'Claude',
              },
            ],
          },
          { label: 'COO', icon: 'process', tool: 'Claude' },
        ],
      },
    },
    preview: {
      layout: 'tree',
      mode: 'pulses',
      accent: '#f59e0b',
      root: {
        key: 'ceo',
        label: 'CEO',
        icon: <Users className="w-full h-full text-white" />,
        children: [
          {
            key: 'cmo',
            label: 'CMO',
            icon: (
              <LetterIcon
                className="w-full h-full"
                letter="M"
                color="#ff6b9d"
              />
            ),
          },
          {
            key: 'cto',
            label: 'CTO',
            icon: (
              <LetterIcon
                className="w-full h-full"
                letter="T"
                color="#c74bb5"
              />
            ),
            children: [
              {
                key: 'eng1',
                label: 'Engineer',
                icon: (
                  <LetterIcon
                    className="w-full h-full"
                    letter="E"
                    color="#f5c84b"
                  />
                ),
              },
              {
                key: 'eng2',
                label: 'Engineer',
                icon: (
                  <LetterIcon
                    className="w-full h-full"
                    letter="E"
                    color="#f5c84b"
                  />
                ),
              },
            ],
          },
          {
            key: 'coo',
            label: 'COO',
            icon: (
              <LetterIcon
                className="w-full h-full"
                letter="O"
                color="#ff8a5c"
              />
            ),
          },
        ],
      },
    },
  },
];

// One-tap starting points for the generator, so users aren't staring at a blank
// box wondering what to type.
const EXAMPLE_PROMPTS = [
  'SaaS architecture with auth, billing & analytics',
  'Customer onboarding journey',
  'CI/CD pipeline with tests and deploy',
  'Marketing funnel from ads to signups',
  'Microservices with API gateway & message bus',
];

export default function FlowVizArchitect({
  flowchartId,
}: { flowchartId?: string }) {
  const router = useRouter();
  const {
    user: currentUser,
    isLoading: authLoading,
    isAuthenticated,
  } = useCurrentUserWithStatus();
  const currentPath = useLocalePathname();
  const {
    flowchart,
    loading: flowchartLoading,
    error: flowchartError,
  } = useFlowchart(flowchartId);

  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animationType, setAnimationType] = useState<PreviewMode>('dots');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Floating bottom composer — the primary way into both AI entry points.
  const [composerMode, setComposerMode] = useState<ComposerMode>('describe');
  const [composerCollapsed, setComposerCollapsed] = useState(false);
  // Text handed from the composer to the Text-to-visuals panel.
  const [composerSeedText, setComposerSeedText] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'templates' | 'text'>(
    'templates'
  );
  // Pinned visual style from an applied "text to visuals" suggestion. Persisted
  // with the flowchart so e.g. a timeline reopens as a pipeline, not a random
  // hash-derived layout. Cleared when another flow replaces the diagram.
  const [savedStyle, setSavedStyle] = useState<{
    layout?: TemplateLayout;
    accent?: string;
  }>({});
  const [templateQuery, setTemplateQuery] = useState('');
  const [diagramData, setDiagramData] = useState<any>({
    center: { label: 'AI Engine', icon: 'bot' },
    satellites: [
      { label: 'Google Drive', icon: 'drive' },
      { label: 'Notion', icon: 'layers' },
      { label: 'WhatsApp', icon: 'chat' },
      { label: 'Google Docs', icon: 'mail' },
      { label: 'Zapier', icon: 'zap' },
      { label: 'Messenger', icon: 'chat' },
    ],
  });
  const [activePreview, setActivePreview] = useState<PreviewSpec | null>(
    TEMPLATES[0].preview
  );
  const [activeTemplate, setActiveTemplate] = useState<
    (typeof TEMPLATES)[number] | null
  >(TEMPLATES[0]);
  const [positionOverrides, setPositionOverrides] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [labelOverrides, setLabelOverrides] = useState<Record<string, string>>(
    {}
  );
  // In-canvas element editor: selection + icon/logo swaps + deletions.
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [iconOverrides, setIconOverrides] = useState<
    Record<string, IconOverride>
  >({});
  const [deletedKeys, setDeletedKeys] = useState<string[]>([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [exportPreset, setExportPreset] = useState<ExportPreset>('original');
  // Export is a two-step flow: pick a file type in the toolbar, then confirm
  // size (and see the watermark/upgrade pitch) in the dialog.
  const [exportFormat, setExportFormat] = useState<ExportFormat>('gif');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>();
  // Active plan (from the Stripe subscription) — the only thing it changes
  // about an export is the watermark. Defaults to free until detected.
  const userPlan = useUserPlan();
  const [sidebarImage, setSidebarImage] = useState<string | null>(null);
  const sidebarFileRef = useRef<HTMLInputElement>(null);

  const [currentTitle, setCurrentTitle] = useState<string>('Untitled');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState<string>('Untitled');
  const [isSaving, setIsSaving] = useState(false);
  const [localFlowchartId, setLocalFlowchartId] = useState<string | undefined>(
    flowchartId
  );
  const autoGenerateTriggered = useRef(false);

  const exportContainerRef = useRef<HTMLDivElement>(null);
  const {
    exportPNG,
    exportSVG,
    exportGIF,
    exportMP4,
    isExporting,
    exportProgress,
    exportStage,
    cancelExport,
  } = useFlowchartExport(exportContainerRef);

  // Measure the live canvas frame so the diagram layout can be recomputed for
  // the current aspect ratio (fixes portrait/landscape squish).
  const canvasFrameRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const canvasDims = useMemo(
    () =>
      canvasSize.w && canvasSize.h
        ? makeCanvasDims(canvasSize.w, canvasSize.h)
        : undefined,
    [canvasSize.w, canvasSize.h]
  );
  // Re-arrange horizontal layouts to radial when the frame is portrait.
  const renderSpec = useMemo(
    () => adaptSpecToAspect(activePreview, canvasDims),
    [activePreview, canvasDims]
  );
  // Element edits (icon/logo swaps + deletions) layer on top of the rendered
  // spec; the inspector reads node info from the same edited spec.
  const editedSpec = useMemo(
    () => applyElementEdits(renderSpec, new Set(deletedKeys), iconOverrides),
    [renderSpec, deletedKeys, iconOverrides]
  );
  // The user's picked connection color (savedStyle.accent) wins over the
  // template's baked-in accent — recolors dots/beams/pulses/arrows live, and
  // saveFlowchart already persists savedStyle.accent so it round-trips.
  const styledSpec = useMemo(
    () =>
      editedSpec &&
      savedStyle.accent &&
      (editedSpec as any).accent !== savedStyle.accent
        ? ({ ...(editedSpec as any), accent: savedStyle.accent } as PreviewSpec)
        : editedSpec,
    [editedSpec, savedStyle.accent]
  );
  // What the connections are actually drawn with right now — mirrors
  // AnimatedPreview's `spec.accent || '#ff5b8a'` fallback for the swatch UI.
  const currentAccent =
    savedStyle.accent || (editedSpec as any)?.accent || '#ff5b8a';
  const nodeIndex = useMemo(() => indexSpecNodes(editedSpec), [editedSpec]);
  const selectedNode = useMemo(() => {
    if (!selectedKey) return null;
    const info = nodeIndex[selectedKey];
    if (!info) return null;
    return {
      key: selectedKey,
      label: labelOverrides[selectedKey] ?? info.label,
      isCenter: info.isCenter,
    };
  }, [selectedKey, nodeIndex, labelOverrides]);

  // When a saved flowchart is loaded we restore element edits, then set this so
  // the effect below doesn't immediately wipe them on the activePreview swap.
  const skipEditResetRef = useRef(false);

  // A new diagram (generate / template / load) clears element selection + edits.
  useEffect(() => {
    setSelectedKey(null);
    if (skipEditResetRef.current) {
      skipEditResetRef.current = false;
      return;
    }
    setIconOverrides({});
    setDeletedKeys([]);
  }, [activePreview]);

  // Identity of the spec currently on canvas — lets async svgl logo enrichment
  // discard its result if the user has already moved to another preview.
  const activePreviewIdRef = useRef<PreviewSpec | null>(null);
  useEffect(() => {
    activePreviewIdRef.current = activePreview;
  }, [activePreview]);

  // Export is gated behind sign-in. These drive the "progress saved" dialog and
  // the resume-after-login flow.
  const [showExportAuth, setShowExportAuth] = useState(false);
  const [authGateReason, setAuthGateReason] = useState<'export' | 'generate'>(
    'export'
  );
  const [pendingExportFormat, setPendingExportFormat] =
    useState<ExportFormat | null>(null);
  const exportResumeTriggered = useRef(false);

  useEffect(() => {
    if (!flowchart) return;
    setCurrentTitle(flowchart.title || 'Untitled');
    setTempTitle(flowchart.title || 'Untitled');
    if (!flowchart.content) return;
    try {
      const parsed = JSON.parse(flowchart.content);
      // v2 content wraps the base diagram + the user's element edits; older
      // (v1) content is the raw diagram object itself.
      const isV2 = parsed && parsed.v === 2 && parsed.diagram;
      const diagram = isV2 ? parsed.diagram : parsed;
      const isTree = diagram?.layout === 'tree' && diagram?.root;
      const isHub = diagram?.center && diagram?.satellites;
      if (!diagram || typeof diagram !== 'object' || !(isHub || isTree)) return;

      setDiagramData(diagram);
      const pinnedLayout = (isV2 ? parsed.previewLayout : undefined) as
        | TemplateLayout
        | undefined;
      const pinnedAccent = (isV2 ? parsed.accent : undefined) as
        | string
        | undefined;
      if (isV2) {
        // Restore the saved element edits and tell the edit-reset effect to skip
        // the wipe it would otherwise run when activePreview changes below.
        skipEditResetRef.current = true;
        setAnimationType(parsed.mode || 'dots');
        setPositionOverrides(parsed.positionOverrides || {});
        setLabelOverrides(parsed.labelOverrides || {});
        setIconOverrides(parsed.iconOverrides || {});
        setDeletedKeys(parsed.deletedKeys || []);
        setSavedStyle({ layout: pinnedLayout, accent: pinnedAccent });
      }
      // Derive an animated spec so a reopened flowchart renders through
      // AnimatedPreview + the shared icon registry (real brand/3D icons). Node
      // keys are stable (center, sat-N), so the restored edits above re-apply.
      const spec = derivePreviewSpec(
        {
          slug: 'saved',
          title: flowchart.title || 'Diagram',
          shortDescription: '',
          longDescription: '',
          category: '',
          categoryName: '',
          tags: [],
          keywords: [],
          layout: isTree ? 'tree' : 'hub',
          data: diagram,
          faqs: [],
          useCases: [],
          // A visual applied from "text to visuals" pins its layout + accent so
          // it reopens exactly as applied (e.g. a timeline stays a pipeline).
          style:
            pinnedLayout || pinnedAccent
              ? { layout: pinnedLayout, accent: pinnedAccent }
              : undefined,
        } as Template,
        pinnedAccent || '#6366f1'
      );
      setActivePreview(spec);
    } catch (e) {
      console.error('Failed to parse existing flowchart content');
    }
  }, [flowchart]);

  useEffect(() => {
    if (typeof window === 'undefined' || autoGenerateTriggered.current) return;
    const autoGenerate = localStorage.getItem('flowchart_auto_generate');
    const autoInput = localStorage.getItem('flowchart_auto_input');
    const autoImage = localStorage.getItem('flowchart_image');
    const autoAspect = localStorage.getItem('flowchart_aspect');
    if (autoGenerate !== 'true' || (!autoInput && !autoImage)) return;
    if (authLoading) return;
    if (autoInput) setTopic(autoInput);
    if (autoAspect) setExportPreset(autoAspect as ExportPreset);
    autoGenerateTriggered.current = true;
    generateDiagram(undefined, autoInput || undefined, autoImage || undefined);
    localStorage.removeItem('flowchart_image');
    localStorage.removeItem('flowchart_aspect');
  }, [authLoading, isAuthenticated]);

  // Keep canvasSize in sync with the rendered frame (aspect changes, sidebar
  // toggles, window resizes). Rounded + thresholded so the diagram doesn't
  // re-layout on sub-pixel jitter.
  useEffect(() => {
    const el = canvasFrameRef.current;
    if (!el) return;
    const update = () => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      setCanvasSize((prev) =>
        Math.abs(prev.w - w) > 2 || Math.abs(prev.h - h) > 2 ? { w, h } : prev
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Deep link: /canvas?tab=text opens the editor on the "Text to visuals"
  // tab (used by the site header/footer nav).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (new URLSearchParams(window.location.search).get('tab') === 'text') {
      setSidebarTab('text');
    }
  }, []);

  // Deep link: /canvas?template=<slug> opens the editor with that catalog
  // template's diagram pre-loaded (used by the /templates collection pages).
  const templateDeepLinkTriggered = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined' || templateDeepLinkTriggered.current)
      return;
    if (flowchartId) return; // editing an existing flowchart takes priority
    const slug = new URLSearchParams(window.location.search).get('template');
    if (!slug) return;
    const tpl = getTemplateBySlug(slug);
    if (!tpl) return;
    templateDeepLinkTriggered.current = true;
    const spec = derivePreviewSpec(tpl, accentForCategory(tpl.category));
    setDiagramData(tpl.data);
    setActivePreview(spec);
    setActiveTemplate({
      id: tpl.slug,
      label: tpl.title,
      icon: <Layers size={18} />,
      topic: templateTopicSeed(tpl),
      data: tpl.data,
      preview: spec,
    });
    setTopic('');
    setCurrentTitle(tpl.title);
    setTempTitle(tpl.title);
  }, [flowchartId]);

  // After an unauthenticated user signs in (export gate), restore their saved
  // diagram and resume the export they were attempting.
  useEffect(() => {
    if (typeof window === 'undefined' || exportResumeTriggered.current) return;
    if (authLoading || !isAuthenticated) return;
    const raw = localStorage.getItem('flowchart_pending_export');
    if (!raw) return;
    exportResumeTriggered.current = true;
    localStorage.removeItem('flowchart_pending_export');
    try {
      const saved = JSON.parse(raw);
      if (saved.data) {
        setDiagramData(saved.data);
        // Rebuild an animated preview spec from the plain diagram data so the
        // restored canvas (and any resumed GIF/MP4 export) animates correctly.
        const spec = derivePreviewSpec(
          {
            slug: saved.title || 'diagram',
            title: saved.title || 'Diagram',
            shortDescription: '',
            longDescription: '',
            category: '',
            categoryName: '',
            tags: [],
            keywords: [],
            layout: saved.data?.layout === 'tree' ? 'tree' : 'hub',
            data: saved.data,
            faqs: [],
            useCases: [],
          } as any,
          '#8b5cf6'
        );
        setActivePreview(spec);
      }
      if (saved.title) {
        setCurrentTitle(saved.title);
        setTempTitle(saved.title);
      }
      if (saved.preset) setExportPreset(saved.preset);
      if (saved.mode) setAnimationType(saved.mode);
      if (saved.format) {
        setPendingExportFormat(saved.format);
        toast.success('Welcome back — picking up your export…');
      }
    } catch {
      // ignore malformed resume payload
    }
  }, [authLoading, isAuthenticated]);

  // Once the restored diagram has rendered, reopen the export dialog on the
  // format they were attempting. It stops short of downloading on purpose:
  // they've just signed in, so this is the right moment to show what the
  // export will look like — watermark included — before it runs.
  useEffect(() => {
    if (!pendingExportFormat || !isAuthenticated || !activePreview) return;
    if (isExporting) return;
    const fmt = pendingExportFormat;
    const id = setTimeout(() => {
      setExportFormat(fmt);
      setExportDialogOpen(true);
      setPendingExportFormat(null);
    }, 900);
    return () => clearTimeout(id);
  }, [pendingExportFormat, isAuthenticated, activePreview, isExporting]);

  // Close the export dialog once a run finishes (or is canceled). The hook
  // owns `isExporting`, so watch its falling edge rather than guessing.
  const wasExporting = useRef(false);
  useEffect(() => {
    if (wasExporting.current && !isExporting) setExportDialogOpen(false);
    wasExporting.current = isExporting;
  }, [isExporting]);

  const handleTitleChange = async (newTitle: string) => {
    setCurrentTitle(newTitle);
    const idToUse = localFlowchartId || flowchartId;
    if (idToUse) {
      try {
        await fetch(`/api/flowcharts/${idToUse}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle }),
        });
      } catch (error) {
        console.error('Error updating title:', error);
      }
    }
  };

  // Re-layout the current hub diagram in a different visual style (radial /
  // orbit / hub-lr / pipeline). Node keys are stable (center, sat-N) so label
  // and icon edits survive; drag positions don't transfer between layouts.
  const switchLayout = (l: TemplateLayout) => {
    if (!diagramData || !('center' in diagramData)) return;
    const accent =
      (activePreview as any)?.accent || savedStyle.accent || '#6366f1';
    const bg = (activePreview as any)?.bg;
    skipEditResetRef.current = true;
    setSavedStyle((s) => ({ ...s, layout: l }));
    setPositionOverrides({});
    setActivePreview(
      derivePreviewSpec(
        {
          slug: 'restyled',
          title: currentTitle,
          shortDescription: '',
          longDescription: '',
          category: '',
          categoryName: '',
          tags: [],
          keywords: [],
          layout: 'hub',
          data: diagramData,
          faqs: [],
          useCases: [],
          style: { layout: l, mode: animationType, accent, bg },
        },
        accent
      )
    );
  };

  const saveFlowchart = async (
    dataToSave: any,
    customTitle?: string,
    snapshot?: {
      mode?: PreviewMode;
      positionOverrides?: Record<string, { x: number; y: number }>;
      labelOverrides?: Record<string, string>;
      iconOverrides?: Record<string, IconOverride>;
      deletedKeys?: string[];
      previewLayout?: TemplateLayout;
      accent?: string;
    }
  ) => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      // Persist the FULL editor state (base diagram + every element edit), so
      // reopening restores exactly what the user last saw — not just the base
      // diagram. `snapshot` lets callers pass post-update values that aren't yet
      // reflected in this render's state (e.g. right after generate).
      const content = JSON.stringify({
        v: 2,
        diagram: dataToSave,
        mode: snapshot?.mode ?? animationType,
        positionOverrides: snapshot?.positionOverrides ?? positionOverrides,
        labelOverrides: snapshot?.labelOverrides ?? labelOverrides,
        iconOverrides: snapshot?.iconOverrides ?? iconOverrides,
        deletedKeys: snapshot?.deletedKeys ?? deletedKeys,
        previewLayout: snapshot?.previewLayout ?? savedStyle.layout,
        accent: snapshot?.accent ?? savedStyle.accent,
      });
      const titleToSave =
        currentTitle !== 'Untitled'
          ? currentTitle
          : customTitle || topic || 'Untitled';
      const idToUse = localFlowchartId || flowchartId;
      if (idToUse) {
        await fetch(`/api/flowcharts/${idToUse}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, title: titleToSave }),
        });
        toast.success('Flowchart saved successfully');
        return idToUse;
      }
      const response = await fetch('/api/flowcharts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title: titleToSave }),
      });
      if (response.ok) {
        const newFlowchart = await response.json();
        toast.success('Created new flowchart');
        if (newFlowchart.id) {
          setLocalFlowchartId(newFlowchart.id);
          window.history.replaceState(null, '', `/canvas/${newFlowchart.id}`);
          return newFlowchart.id as string;
        }
      }
    } catch (err) {
      toast.error('Failed to save flowchart');
    } finally {
      setIsSaving(false);
    }
    return undefined;
  };

  const generateDiagram = async (
    e?: React.FormEvent,
    customTopic?: string,
    imageBase64?: string
  ) => {
    if (e) e.preventDefault();
    const userPrompt = (customTopic || topic).trim();
    if (!userPrompt && !imageBase64) return;
    // The user's prompt is the subject. The active template only supplies the
    // visual style (layout/mode/accent) via buildPreviewFromAI — its topic must
    // NOT be mixed in, or e.g. the default Chatbot template leaks "Dialog
    // Manager" nodes into an unrelated diagram.
    const activeTopic = userPrompt;
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, string> = {};
      if (activeTopic) body.topic = activeTopic;
      if (imageBase64) body.image = imageBase64;
      const response = await fetch('/api/ai/flowviz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.status === 401) {
        setLoading(false);
        setAuthGateReason('generate');
        setShowExportAuth(true);
        return;
      }
      if (response.status === 429) {
        // Out of credits on the main generate box — the highest-intent moment
        // in the product. Show the upgrade dialog, not a toast that vanishes.
        const data = await response.json().catch(() => ({}) as any);
        setLoading(false);
        openUpgrade(
          data.message ||
            "You've used all your free AI generations. Upgrade for 500 a month and watermark-free exports."
        );
        return;
      }
      if (!response.ok) throw new Error('Generation failed');
      const result = await response.json();
      // Keep the active template's layout/mode; swap icons + labels using the
      // AI-generated satellites so the animated-beam preview stays consistent.
      const nextPreview = buildPreviewFromAI(result, activeTemplate);
      // Pull real brand logos from the svgl catalog for any node label the
      // local registry can't brand — awaited (3s-guarded) before first paint
      // so the diagram lands fully branded instead of logos popping in.
      const autoLogos = await autoLogoOverrides(nextPreview);
      setDiagramData(result);
      if (nextPreview) skipEditResetRef.current = true; // seeding fresh edits
      setActivePreview(nextPreview);
      setSelectedKey(null);
      setIconOverrides(autoLogos);
      setDeletedKeys([]);
      setPositionOverrides({});
      setLabelOverrides({});
      setSavedStyle({});
      localStorage.removeItem('flowchart_auto_generate');
      localStorage.removeItem('flowchart_auto_input');
      if (currentTitle === 'Untitled') {
        setCurrentTitle(userPrompt);
        setTempTitle(userPrompt);
      }
      // A freshly generated diagram starts from the auto logo overrides only —
      // never this render's override state, which may hold the prior diagram's.
      saveFlowchart(result, userPrompt, {
        mode: animationType,
        positionOverrides: {},
        labelOverrides: {},
        iconOverrides: autoLogos,
        deletedKeys: [],
      });
    } catch (err: any) {
      setError('Failed to generate diagram.');
      toast.error(err.message || 'Failed to generate diagram');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: (typeof TEMPLATES)[number]) => {
    setTopic('');
    setDiagramData(template.data);
    setActivePreview(template.preview);
    setActiveTemplate(template);
    setPositionOverrides({});
    setLabelOverrides({});
    setSavedStyle({});
    if (currentTitle === 'Untitled') {
      setCurrentTitle(template.label);
      setTempTitle(template.label);
    }
  };

  // Load a full catalog template (the 98 from /templates) straight into the
  // editor. Shared by the ?template= deep link and the sidebar search.
  const loadCatalogTemplate = (tpl: Template) => {
    const spec = derivePreviewSpec(tpl, accentForCategory(tpl.category));
    setDiagramData(tpl.data);
    setActivePreview(spec);
    setActiveTemplate({
      id: tpl.slug,
      label: tpl.title,
      icon: <Layers size={18} />,
      topic: templateTopicSeed(tpl),
      data: tpl.data,
      preview: spec,
    });
    setPositionOverrides({});
    setLabelOverrides({});
    setSavedStyle({});
    setTopic('');
    if (currentTitle === 'Untitled') {
      setCurrentTitle(tpl.title);
      setTempTitle(tpl.title);
    }
  };

  // ---- Text → visuals (long-form text, Napkin-style) ------------------------
  // Live-preview a suggestion on the canvas. Selecting different suggestions
  // swaps the diagram; the edit-reset effect clears element edits each time.
  const previewVisual = (v: AppliedVisual) => {
    setDiagramData(v.data);
    setActivePreview(v.spec);
    setAnimationType(v.mode);
    setPositionOverrides({});
    setLabelOverrides({});
    setSavedStyle({ layout: v.layout, accent: v.accent });
    if (v.orientation === 'portrait') setExportPreset('portrait');
    else if (v.orientation === 'landscape') setExportPreset('landscape');
    // Brand-logo enrichment lands async (fast — svgl responses are cached).
    // Yield a tick so the edit-reset effect for this preview swap runs FIRST,
    // then apply only if this spec is still the one on canvas; any overrides
    // the user managed to make meanwhile win over the automatic ones.
    void autoLogoOverrides(v.spec).then(async (auto) => {
      if (Object.keys(auto).length === 0) return;
      await new Promise((r) => setTimeout(r, 0));
      if (activePreviewIdRef.current !== v.spec) return;
      setIconOverrides((prev) => ({ ...auto, ...prev }));
    });
  };

  // "Save and Apply": commit the chosen visual — title it and persist with its
  // pinned layout/accent so it reloads exactly as applied.
  const applyVisual = async (v: AppliedVisual) => {
    previewVisual(v);
    if (currentTitle === 'Untitled') {
      setCurrentTitle(v.title);
      setTempTitle(v.title);
    }
    if (!currentUser) {
      toast.success('Applied to canvas — sign in to save it to your library');
      return;
    }
    // Same enrichment previewVisual applied on canvas (cached — near-instant
    // here), so the saved document reloads with its real brand logos.
    const autoLogos = await autoLogoOverrides(v.spec);
    saveFlowchart(v.data, v.title, {
      mode: v.mode,
      positionOverrides: {},
      labelOverrides: {},
      iconOverrides: autoLogos,
      deletedKeys: [],
      previewLayout: v.layout,
      accent: v.accent,
    });
  };

  // Catalog search for the sidebar (matches title, description, category, tags).
  const templateResults = useMemo(() => {
    const q = templateQuery.trim().toLowerCase();
    if (!q) return [] as Template[];
    const terms = q.split(/\s+/).filter(Boolean);
    return allTemplates
      .filter((t) => {
        const hay =
          `${t.title} ${t.shortDescription} ${t.categoryName} ${t.tags.join(' ')} ${t.keywords.join(' ')}`.toLowerCase();
        return terms.every((term) => hay.includes(term));
      })
      .slice(0, 40);
  }, [templateQuery]);

  const openUpgrade = (reason?: string) => {
    setUpgradeReason(reason);
    setUpgradeOpen(true);
  };

  // Runs the actual download. Every plan exports at the same size and quality;
  // the only thing the plan changes is whether the watermark is stamped.
  const runExport = (format: ExportFormat | 'svg') => {
    const opts = { watermark: PLAN_BY_ID[userPlan].limits.watermark };
    if (format === 'png') exportPNG(currentTitle, exportPreset, opts);
    else if (format === 'svg') exportSVG(currentTitle, exportPreset, opts);
    else if (format === 'gif') exportGIF(currentTitle, exportPreset, opts);
    else exportMP4(currentTitle, exportPreset, opts);
  };

  // Step 1 of export: pick a file type. Exporting requires an account — if the
  // user is signed out, stash their work and prompt sign-in; the resume effect
  // picks the export back up afterwards. Otherwise open the export dialog,
  // which is where size is chosen and the run is confirmed.
  const handleExport = (format: ExportFormat) => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(
          'flowchart_pending_export',
          JSON.stringify({
            format,
            data: diagramData,
            title: currentTitle,
            preset: exportPreset,
            mode: animationType,
          })
        );
      } catch {
        // storage may be unavailable; still prompt for sign-in
      }
      // Defer so the export dropdown can close before the dialog takes focus.
      setAuthGateReason('export');
      setTimeout(() => setShowExportAuth(true), 30);
      return;
    }
    setExportFormat(format);
    setTimeout(() => setExportDialogOpen(true), 30);
  };

  const handleManualSave = () => {
    if (!currentUser) {
      toast.error('Please sign in to save your work.');
      return;
    }
    saveFlowchart(diagramData);
  };

  // Use a custom logo for the selected element. Read it client-side as a data
  // URL and embed it directly — no R2/storage upload, so it works in any
  // environment (no "storage region not configured"), matches how the sidebar
  // AI-vision image is handled, and stays same-origin so it doesn't taint the
  // canvas during PNG/SVG export the way an external URL would.
  const handleLogoUpload = async (file: File) => {
    if (!selectedKey) return;
    const key = selectedKey;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo too large — please use an image under 2 MB.');
      return;
    }
    setUploadingLogo(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Could not read the image'));
        reader.readAsDataURL(file);
      });
      setIconOverrides((p) => ({
        ...p,
        [key]: { kind: 'image', url: dataUrl },
      }));
      toast.success('Logo added');
    } catch (err: any) {
      toast.error(err?.message || 'Could not add logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Apply a brand logo picked from the svgl catalog in the inspector. The SVG
  // is inlined as a data: URL — same contract as an uploaded logo, so it
  // renders everywhere and never taints export rasterization.
  const handlePickLogo = async (logo: { title: string; url: string }) => {
    if (!selectedKey) return;
    const key = selectedKey;
    const dataUrl = await fetchSvglDataUrl(logo.url);
    if (!dataUrl) {
      toast.error('Could not load that logo — try another.');
      return;
    }
    setIconOverrides((p) => ({ ...p, [key]: { kind: 'image', url: dataUrl } }));
  };

  const handleDeleteSelected = () => {
    if (!selectedKey) return;
    setDeletedKeys((d) => [...d, selectedKey]);
    setSelectedKey(null);
  };

  if (flowchartId && flowchartLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
          <p className="text-muted-foreground">Loading your architecture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="infogiph-home h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-border bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Back to home"
            className="h-9 w-9 rounded-lg border border-border hover:bg-[#fafafa]"
            onClick={() => router.push('/')}
          >
            <ChevronLeft size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle templates"
            className="h-9 w-9 rounded-lg hover:bg-[#fafafa]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={18} />
            ) : (
              <PanelLeftOpen size={18} />
            )}
          </Button>
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              {isEditingTitle ? (
                <Input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleChange(tempTitle);
                      setIsEditingTitle(false);
                    } else if (e.key === 'Escape') {
                      setTempTitle(currentTitle);
                      setIsEditingTitle(false);
                    }
                  }}
                  onBlur={() => {
                    handleTitleChange(tempTitle);
                    setIsEditingTitle(false);
                  }}
                  className="h-9 px-3 text-sm font-semibold w-56 rounded-lg"
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTempTitle(currentTitle);
                    setIsEditingTitle(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold max-w-56 hover:bg-[#fafafa] transition-colors"
                >
                  <span className="truncate">{currentTitle}</span>
                  <Edit className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </button>
              )}
            </div>
          ) : (
            <img
              src="/infogiph-logo.png"
              alt="Infogiph"
              className="h-6 w-auto px-1"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          {diagramData && 'center' in diagramData && activePreview ? (
            <>
              <Select
                value={(activePreview as any).layout ?? 'radial'}
                onValueChange={(v) => v && switchLayout(v as TemplateLayout)}
              >
                <SelectTrigger
                  size="sm"
                  className="h-9 w-[132px] rounded-lg bg-white text-xs font-medium"
                  aria-label="Diagram style"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Orbit size={14} className="shrink-0 opacity-70" />
                    <SelectValue placeholder="Style" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radial">Radial</SelectItem>
                  <SelectItem value="orbit">Orbit</SelectItem>
                  <SelectItem value="cycle">Cycle</SelectItem>
                  <SelectItem value="hub-lr">Hub</SelectItem>
                  <SelectItem value="pipeline">Pipeline</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                  <SelectItem value="steps">Steps</SelectItem>
                  <SelectItem value="funnel">Funnel</SelectItem>
                  <SelectItem value="pyramid">Pyramid</SelectItem>
                  <SelectItem value="quadrant">Quadrant</SelectItem>
                  <SelectItem value="columns">Columns</SelectItem>
                  <SelectItem value="iceberg">Iceberg</SelectItem>
                  <SelectItem value="tree">Tree</SelectItem>
                </SelectContent>
              </Select>

              <div className="mx-1 h-6 w-px bg-border" />
            </>
          ) : null}

          <ToggleGroup
            type="single"
            value={animationType}
            onValueChange={(v) => v && setAnimationType(v as PreviewMode)}
            variant="outline"
            size="sm"
            className="rounded-lg bg-white border border-border p-0.5"
          >
            <ToggleGroupItem
              value="dots"
              className="gap-1.5 text-xs px-2.5 rounded-md data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              <CircleDot size={14} /> Dots
            </ToggleGroupItem>
            <ToggleGroupItem
              value="beams"
              className="gap-1.5 text-xs px-2.5 rounded-md data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              <LineChart size={14} /> Beams
            </ToggleGroupItem>
            <ToggleGroupItem
              value="pulses"
              className="gap-1.5 text-xs px-2.5 rounded-md data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              <Activity size={14} /> Pulses
            </ToggleGroupItem>
            <ToggleGroupItem
              value="arrows"
              className="gap-1.5 text-xs px-2.5 rounded-md data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              <ArrowRight size={14} /> Arrows
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Connection color — recolors the dots/beams/pulses/arrows. One
              click on a preset applies live; Save persists it (same field the
              text-to-visuals accent already uses). */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Connection color"
                title="Connection color"
                className="h-9 gap-2 rounded-lg border border-border bg-white px-2.5 text-xs hover:bg-[#fafafa]"
              >
                <span
                  className="h-4 w-4 rounded-full border border-black/10"
                  style={{ backgroundColor: currentAccent }}
                />
                Color
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-3">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Connection color
              </p>
              <div className="grid grid-cols-6 gap-1.5">
                {ACCENT_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Use ${c}`}
                    onClick={() => setSavedStyle((s) => ({ ...s, accent: c }))}
                    className="flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                  >
                    {currentAccent.toLowerCase() === c.toLowerCase() && (
                      <CheckCircle2 size={14} className="text-white" />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <label className="relative flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border text-xs font-medium hover:bg-[#fafafa]">
                  <Pipette size={13} />
                  Custom
                  <input
                    type="color"
                    value={currentAccent}
                    onChange={(e) =>
                      setSavedStyle((s) => ({ ...s, accent: e.target.value }))
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-muted-foreground"
                  onClick={() =>
                    setSavedStyle((s) => ({ ...s, accent: undefined }))
                  }
                >
                  Auto
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="mx-1 h-6 w-px bg-border" />

          <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">
              Speed
            </span>
            <input
              type="range"
              min={0.3}
              max={3}
              step={0.1}
              value={animationSpeed}
              onChange={(e) =>
                setAnimationSpeed(Number.parseFloat(e.target.value))
              }
              className="w-20 accent-foreground"
            />
            <span className="text-[11px] font-semibold tabular-nums text-foreground/80 w-8 text-right">
              {animationSpeed.toFixed(1)}x
            </span>
          </div>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Export — pick a file type here, everything else (size, watermark,
              upgrade) lives in the dialog this opens. */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isExporting}
                className="gap-1.5 text-xs rounded-lg border-border hover:bg-[#fafafa]"
              >
                {isExporting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                Export
                {isExporting && exportProgress > 0 ? ` ${exportProgress}%` : ''}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Choose a file type
              </DropdownMenuLabel>
              {(['gif', 'mp4', 'png'] as ExportFormat[]).map((f) => {
                const meta = EXPORT_FORMATS[f];
                const Icon = meta.icon;
                return (
                  <DropdownMenuItem
                    key={f}
                    onClick={() => handleExport(f)}
                    className="flex items-start gap-2.5 py-2"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {meta.label}
                      </span>
                      <span className="block text-[11px] leading-snug text-muted-foreground">
                        {meta.blurb}
                      </span>
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-lg border-border hover:bg-[#fafafa]"
            onClick={() => router.push('/dashboard')}
          >
            Dashboard
          </Button>

          {currentUser && (
            <Button
              size="sm"
              onClick={handleManualSave}
              disabled={isSaving}
              className="text-xs gap-1.5 rounded-lg bg-foreground text-background hover:bg-neutral-800"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save
            </Button>
          )}

          {userPlan !== 'max' && (
            <Button
              size="sm"
              onClick={() =>
                openUpgrade(
                  'Unlock Pro — watermark-free exports and 500 AI generations a month.'
                )
              }
              className="ig-gradient text-xs gap-1.5 rounded-lg text-white shadow-[0_2px_10px_rgba(255,107,157,0.35)] hover:opacity-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Upgrade
            </Button>
          )}

          {currentUser ? (
            <UserButton user={currentUser} />
          ) : (
            <LoginWrapper mode="modal" asChild callbackUrl={currentPath}>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1.5 rounded-lg hover:bg-[#fafafa]"
              >
                <User className="h-3.5 w-3.5" /> Sign In
              </Button>
            </LoginWrapper>
          )}
        </div>
      </div>

      {/* Sign-in gate — shown before an export, and before a generation (which
          costs a credit and so needs an account to bill it to). */}
      <SignInTakeover
        open={showExportAuth}
        onOpenChange={setShowExportAuth}
        callbackUrl={currentPath}
        title={
          authGateReason === 'generate'
            ? 'Sign in to generate your diagram'
            : 'Sign in to export your diagram'
        }
        subtitle={
          authGateReason === 'generate'
            ? 'Create a free account in one click — your prompt is waiting for you on the other side.'
            : 'Create a free account in one click and your download starts right after.'
        }
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        format={exportFormat}
        preset={exportPreset}
        onPresetChange={setExportPreset}
        plan={userPlan}
        isExporting={isExporting}
        exportProgress={exportProgress}
        exportStage={exportStage}
        onExport={() => runExport(exportFormat)}
        onCancelExport={cancelExport}
        returnTo={
          localFlowchartId || flowchartId
            ? `/canvas/${localFlowchartId || flowchartId}`
            : currentPath
        }
        onBeforeCheckout={async () => {
          if (!currentUser || !diagramData) return undefined;
          const id = await saveFlowchart(diagramData);
          return id ? `/canvas/${id}` : undefined;
        }}
      />

      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        reason={upgradeReason}
        returnTo={
          localFlowchartId || flowchartId
            ? `/canvas/${localFlowchartId || flowchartId}`
            : currentPath
        }
        onBeforeCheckout={async () => {
          // Save first so checkout genuinely returns to this exact diagram —
          // a first save mints the /canvas/[id] URL we hand to Stripe.
          if (!currentUser || !diagramData) return undefined;
          const id = await saveFlowchart(diagramData);
          return id ? `/canvas/${id}` : undefined;
        }}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Template Picker / Text to visuals */}
        {sidebarOpen && (
          <div
            className={`flex ${
              sidebarTab === 'text' ? 'w-[340px]' : 'w-[280px]'
            } shrink-0 flex-col border-r border-border bg-[#fafafa] transition-[width] duration-200`}
          >
            {/* Mode tabs */}
            <div className="px-3 pt-3">
              <div className="flex rounded-lg border border-border bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setSidebarTab('templates')}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                    sidebarTab === 'templates'
                      ? 'bg-foreground text-background'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  <LayoutGrid size={13} /> Templates
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab('text')}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                    sidebarTab === 'text'
                      ? 'bg-foreground text-background'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                >
                  <Wand2 size={13} /> Text to visuals
                </button>
              </div>
            </div>

            {/* Kept mounted (hidden) so pasted text + suggestions survive tab
                switches; `contents` delegates layout to the panel itself. */}
            <div className={sidebarTab === 'text' ? 'contents' : 'hidden'}>
              <TextToVisualPanel
                onPreview={previewVisual}
                onApply={applyVisual}
                seedText={composerSeedText}
                onSeedConsumed={() => setComposerSeedText(null)}
              />
            </div>
            {sidebarTab === 'templates' && (
              <>
                {/* Templates header + search */}
                <div className="px-4 pb-3 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-foreground">
                      Templates
                    </h2>
                    <a
                      href="/templates"
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-[11px] font-medium text-foreground/55 transition-colors hover:text-foreground"
                    >
                      Browse all {allTemplates.length} →
                    </a>
                  </div>
                  <div className="relative mt-2.5">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={templateQuery}
                      onChange={(e) => setTemplateQuery(e.target.value)}
                      placeholder={`Search ${allTemplates.length} templates…`}
                      className="h-9 rounded-lg border-border bg-white pl-8 text-xs focus-visible:border-foreground/40 focus-visible:ring-0"
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="space-y-1.5 px-3 pb-3">
                    {templateQuery.trim() ? (
                      templateResults.length > 0 ? (
                        templateResults.map((t) => (
                          <button
                            key={t.slug}
                            type="button"
                            onClick={() => loadCatalogTemplate(t)}
                            className="group flex w-full items-center gap-3 rounded-xl border border-transparent bg-white px-3 py-2.5 text-left transition-all hover:border-border hover:shadow-sm"
                          >
                            <span
                              className="h-9 w-9 shrink-0 rounded-lg"
                              style={{
                                background: `${accentForCategory(t.category)}1a`,
                                border: `1px solid ${accentForCategory(t.category)}40`,
                              }}
                            />
                            <div className="min-w-0">
                              <div className="truncate text-xs font-medium text-foreground">
                                {t.title}
                              </div>
                              <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                                {t.categoryName}
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-8 text-center">
                          <p className="text-xs text-muted-foreground">
                            No templates match “{templateQuery.trim()}”.
                          </p>
                          <a
                            href="/templates"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-xs font-medium text-foreground hover:underline"
                          >
                            Browse all templates →
                          </a>
                        </div>
                      )
                    ) : (
                      <>
                        <p className="px-1 pb-0.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Quick start
                        </p>
                        {TEMPLATES.map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => handleTemplateSelect(template)}
                            className="group flex w-full items-center gap-3 rounded-xl border border-transparent bg-white px-3 py-2.5 text-left text-sm transition-all hover:border-border hover:shadow-sm"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-foreground/70 transition-colors group-hover:text-foreground">
                              {template.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-xs font-medium text-foreground">
                                {template.label}
                              </div>
                              <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                                {template.data.satellites?.length ||
                                  template.data.root?.children?.length ||
                                  0}{' '}
                                nodes
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </ScrollArea>

                {/* The AI generator used to live here, below the template
                    list and under the fold. It's now the floating composer
                    docked at the bottom of the canvas — see <CanvasComposer>. */}
              </>
            )}
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden bg-white">
          <ElementInspector
            node={selectedNode}
            uploading={uploadingLogo}
            onClose={() => setSelectedKey(null)}
            onLabelChange={(label) =>
              selectedKey &&
              setLabelOverrides((p) => ({ ...p, [selectedKey]: label }))
            }
            onIconChange={(iconKey) =>
              selectedKey &&
              setIconOverrides((p) => ({
                ...p,
                [selectedKey]: { kind: 'key', key: iconKey },
              }))
            }
            onPickLogo={handlePickLogo}
            onUploadLogo={handleLogoUpload}
            onDelete={handleDeleteSelected}
          />
          {/* On-canvas brand watermark. Exports get their own watermark baked
              in by finaliseCanvas(), so this stays outside exportContainerRef
              to avoid doubling up in downloads. */}
          <div className="pointer-events-none absolute bottom-4 right-4 z-10 select-none rounded-md bg-[rgba(15,23,42,0.72)] px-2.5 py-1 text-xs font-semibold tracking-tight text-white shadow-sm">
            infogiph.com
          </div>
          {/* Export progress lives in the export dialog, which stays open for
              the duration of a run — see <ExportDialog>. Nothing here. */}

          {/* Both AI entry points, docked over the canvas where they're seen. */}
          <CanvasComposer
            mode={composerMode}
            onModeChange={setComposerMode}
            collapsed={composerCollapsed}
            onCollapsedChange={setComposerCollapsed}
            topic={topic}
            onTopicChange={setTopic}
            onGenerate={() =>
              generateDiagram(undefined, undefined, sidebarImage || undefined)
            }
            generating={loading}
            hasImage={!!sidebarImage}
            onPickImage={(file) => {
              if (file.size > 4 * 1024 * 1024) {
                toast.error('Image must be under 4 MB');
                return;
              }
              const reader = new FileReader();
              reader.onload = () => setSidebarImage(reader.result as string);
              reader.readAsDataURL(file);
            }}
            onClearImage={() => setSidebarImage(null)}
            examplePrompts={EXAMPLE_PROMPTS}
            pasteBusy={false}
            onPasteSubmit={(pasted) => {
              // Hand the text to the sidebar panel, which owns suggestions,
              // parameters and apply — and open it so the results are visible.
              setComposerSeedText(pasted);
              setSidebarTab('text');
              setSidebarOpen(true);
            }}
          />
          <div className="h-full flex items-center justify-center p-6">
            <div
              className="relative rounded-xl border border-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(15,42,62,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,42,62,0.06) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 0 0',
                ...(EXPORT_PRESETS[exportPreset].w &&
                EXPORT_PRESETS[exportPreset].h
                  ? {
                      aspectRatio: `${EXPORT_PRESETS[exportPreset].w} / ${EXPORT_PRESETS[exportPreset].h}`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: '100%',
                    }
                  : {
                      width: '100%',
                      height: '100%',
                    }),
              }}
            >
              <div
                ref={exportContainerRef}
                className="w-full h-full flex items-center justify-center p-8"
              >
                <div ref={canvasFrameRef} className="relative h-full w-full">
                  {styledSpec ? (
                    <AnimatedPreview
                      {...(styledSpec as any)}
                      variant="canvas"
                      dims={canvasDims}
                      modeOverride={animationType}
                      showModeChip={false}
                      editable
                      speed={animationSpeed}
                      positionOverrides={positionOverrides}
                      labelOverrides={labelOverrides}
                      selectedKey={selectedKey}
                      onSelect={setSelectedKey}
                      onPositionChange={(key, x, y) =>
                        setPositionOverrides((p) => ({ ...p, [key]: { x, y } }))
                      }
                      onLabelChange={(key, label) =>
                        setLabelOverrides((p) => ({ ...p, [key]: label }))
                      }
                    />
                  ) : (
                    <DiagramRenderer data={diagramData} mode={animationType} />
                  )}
                  {loading && (
                    <ProcessingOverlay
                      accent={
                        savedStyle.accent ||
                        (activePreview as any)?.accent ||
                        '#6366f1'
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagramRenderer({ data, mode }: { data: any; mode: string }) {
  if (data.layout === 'tree' && data.root) {
    return <TreeDiagramRenderer data={data} />;
  }
  return <RadialDiagramRenderer data={data} mode={mode} />;
}

function TreeDiagramRenderer({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!dims.width) return <div ref={containerRef} className="w-full h-full" />;

  const { width, height } = dims;
  const nw = Math.min(160, width * 0.18);
  const nh = 56;
  const accent = '#d4a017';

  type NodePos = { x: number; y: number; node: any; level: number };
  const nodes: NodePos[] = [];
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  const root = data.root;
  const levelGap = Math.min(height * 0.3, 120);

  // Level 0: root
  const rootX = width / 2;
  const rootY = height * 0.12;
  nodes.push({ x: rootX, y: rootY, node: root, level: 0 });

  // Level 1: children
  const children = root.children || [];
  const l1Y = rootY + levelGap;
  const l1Spacing = Math.min(width / (children.length + 1), width * 0.3);
  const l1Start = width / 2 - ((children.length - 1) * l1Spacing) / 2;

  children.forEach((child: any, i: number) => {
    const x = l1Start + i * l1Spacing;
    nodes.push({ x, y: l1Y, node: child, level: 1 });
    lines.push({ x1: rootX, y1: rootY + nh / 2, x2: x, y2: l1Y - nh / 2 });

    // Level 2: grandchildren
    if (child.children) {
      const l2Y = l1Y + levelGap;
      const gcCount = child.children.length;
      const l2Spacing = Math.min(nw + 40, width * 0.22);
      const l2Start = x - ((gcCount - 1) * l2Spacing) / 2;
      child.children.forEach((gc: any, j: number) => {
        const gx = l2Start + j * l2Spacing;
        nodes.push({ x: gx, y: l2Y, node: gc, level: 2 });
        lines.push({ x1: x, y1: l1Y + nh / 2, x2: gx, y2: l2Y - nh / 2 });
      });
    }
  });

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id="tree-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.08" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bracket-style connections */}
        {lines.map((line, i) => {
          const midY = (line.y1 + line.y2) / 2;
          const pathD = `M ${line.x1} ${line.y1} L ${line.x1} ${midY} L ${line.x2} ${midY} L ${line.x2} ${line.y2}`;
          return (
            <React.Fragment key={i}>
              <motion.path
                d={pathD}
                fill="none"
                stroke="#c8c8c8"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
              />
              <motion.circle
                r="3"
                fill={accent}
                initial={{ '--offset-distance': '0%' } as any}
                animate={{ '--offset-distance': '100%' } as any}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                  delay: i * 0.3,
                }}
                style={
                  {
                    offsetPath: `path("${pathD}")`,
                    offsetDistance: 'var(--offset-distance)',
                  } as React.CSSProperties
                }
              />
            </React.Fragment>
          );
        })}

        {/* Card nodes */}
        {nodes.map((np, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, delay: 0.3 + i * 0.07 }}
          >
            <rect
              x={np.x - nw / 2}
              y={np.y - nh / 2}
              width={nw}
              height={nh}
              rx="12"
              fill="white"
              filter="url(#tree-shadow)"
              stroke="#e5e5e5"
              strokeWidth="1"
            />
            <foreignObject
              x={np.x - nw / 2}
              y={np.y - nh / 2}
              width={nw}
              height={nh}
            >
              <div className="w-full h-full flex items-center gap-2.5 px-3 pointer-events-none">
                <div className="flex-shrink-0 p-1.5 rounded-lg bg-gray-100 text-gray-500">
                  {getIcon(np.node.icon || np.node.label, 18)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-gray-800 leading-tight truncate">
                    {np.node.label}
                  </div>
                  {np.node.role && (
                    <div className="text-[10px] text-gray-500 leading-tight">
                      {np.node.role}
                    </div>
                  )}
                  {np.node.tool && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: accent }}
                      />
                      <span className="text-[10px] text-gray-500">
                        {np.node.tool}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </foreignObject>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

function RadialDiagramRenderer({ data, mode }: { data: any; mode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!dimensions.width)
    return <div ref={containerRef} className="w-full h-full" />;

  const { width, height } = dimensions;
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusX = Math.min(width * 0.35, 400);
  const radiusY = Math.min(height * 0.35, 250);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </radialGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.1" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>

        <AnimatePresence mode="wait">
          <g key={`${JSON.stringify(data)}-${mode}`}>
            {data.satellites?.map((sat: any, i: number) => {
              const angle = (i / data.satellites.length) * 2 * Math.PI;
              const x = centerX + radiusX * Math.cos(angle);
              const y = centerY + radiusY * Math.sin(angle);
              const cp1X = centerX + (x - centerX) * 0.5;
              const cp1Y = centerY;
              const cp2X = centerX + (x - centerX) * 0.5;
              const cp2Y = y;
              const pathD = `M ${centerX} ${centerY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x} ${y}`;

              return (
                <React.Fragment key={i}>
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />

                  {mode === 'dots' &&
                    [0, 0.3, 0.6].map((offset) => (
                      <motion.circle
                        key={offset}
                        r="3"
                        fill="#3b82f6"
                        initial={{ '--offset-distance': '0%' } as any}
                        animate={{ '--offset-distance': '100%' } as any}
                        transition={{
                          duration: 2.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: 'linear',
                          delay: offset + i * 0.2,
                        }}
                        style={
                          {
                            offsetPath: `path("${pathD}")`,
                            offsetDistance: 'var(--offset-distance)',
                          } as React.CSSProperties
                        }
                      />
                    ))}

                  {mode === 'beams' && (
                    <motion.path
                      d={pathD}
                      fill="none"
                      stroke="url(#beamGradient)"
                      strokeWidth="4"
                      strokeDasharray="50, 150"
                      initial={{ strokeDashoffset: 200 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                        delay: i * 0.15,
                      }}
                    />
                  )}

                  {mode === 'pulses' && (
                    <motion.circle
                      cx={centerX}
                      cy={centerY}
                      r="10"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                      initial={
                        {
                          opacity: 0.8,
                          scale: 0,
                          '--offset-distance': '0%',
                        } as any
                      }
                      animate={
                        {
                          opacity: 0,
                          scale: 10,
                          '--offset-distance': '100%',
                        } as any
                      }
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeOut',
                        delay: i * 0.4,
                      }}
                      style={
                        {
                          offsetPath: `path("${pathD}")`,
                          offsetDistance: 'var(--offset-distance)',
                        } as React.CSSProperties
                      }
                    />
                  )}

                  {mode === 'arrows' && (
                    <motion.path
                      d="M -5,-3 L 5,0 L -5,3 Z"
                      fill="#3b82f6"
                      initial={{ '--offset-distance': '0%' } as any}
                      animate={{ '--offset-distance': '100%' } as any}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                        delay: i * 0.1,
                      }}
                      style={
                        {
                          offsetPath: `path("${pathD}")`,
                          offsetDistance: 'var(--offset-distance)',
                          offsetRotate: 'auto',
                        } as React.CSSProperties
                      }
                    />
                  )}

                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      damping: 12,
                      delay: 0.5 + i * 0.1,
                    }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r="40"
                      fill="url(#nodeGradient)"
                      filter="url(#shadow)"
                      className="stroke-slate-200 stroke-1"
                    />
                    <foreignObject x={x - 40} y={y - 40} width="80" height="80">
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                        <div className="text-blue-500 mb-1">
                          {getIcon(sat.icon || sat.label)}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 leading-tight uppercase tracking-tighter line-clamp-2">
                          {sat.label}
                        </span>
                      </div>
                    </foreignObject>
                  </motion.g>
                </React.Fragment>
              );
            })}

            {data.center && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="50"
                  fill="white"
                  filter="url(#shadow)"
                  className="stroke-blue-200 stroke-2"
                />
                <foreignObject
                  x={centerX - 50}
                  y={centerY - 50}
                  width="100"
                  height="100"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                    <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg mb-1">
                      {getIcon(data.center.icon || data.center.label)}
                    </div>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight line-clamp-2">
                      {data.center.label}
                    </span>
                  </div>
                </foreignObject>
              </motion.g>
            )}
          </g>
        </AnimatePresence>
      </svg>
    </div>
  );
}
