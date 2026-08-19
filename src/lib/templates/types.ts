// Shared types for the Infogiph template catalog.
//
// Two representations exist per template:
//  - `RawTemplate` is the flat shape produced by the catalog generator (and the
//    seed data). It is pure JSON — safe to import from server or client.
//  - `Template` is the runtime shape consumed by pages/components, with the
//    canvas `data` already assembled (hub or tree) so it can be loaded straight
//    into the editor at /canvas.

/**
 * An icon key references something in the shared icon registry
 * (`src/lib/templates/icon-registry.tsx`). It can be:
 *  - a concept key  ("bot", "database", "cloud", … — the base set below),
 *  - a brand key    ("openai", "claude", "stripe", "aws", "fedex", …), or
 *  - a 3D key       ("brain3d", "cube3d", "terminal3d", … — rendered flush).
 *
 * It's typed as a permissive string so curated templates can use the full
 * registry vocabulary while the auto-generated catalog sticks to the base
 * concept set. Add new keys in icon-registry.tsx, not here.
 */
export type IconKey = string;

/** The base concept keys the auto-generator is allowed to emit. */
export const ICON_KEYS = [
  'bot',
  'database',
  'cloud',
  'web',
  'chat',
  'drive',
  'mobile',
  'mail',
  'search',
  'process',
  'automation',
  'social',
  'layers',
] as const;

export interface DiagramNode {
  label: string;
  icon: IconKey;
  /**
   * Numeric magnitude for chart layouts (bars, chart-line, donut). Optional —
   * non-chart layouts ignore it, and chart layouts synthesize a pleasing
   * deterministic series when values are absent.
   */
  value?: number;
  /** Display unit for `value` — "%", "$", "k", "M", "users"… */
  unit?: string;
  children?: DiagramNode[];
}

/** Hub-and-spoke diagram — a central node connected to satellites. */
export interface HubDiagramData {
  center: { label: string; icon: IconKey };
  satellites: { label: string; icon: IconKey; value?: number; unit?: string }[];
}

/** Hierarchical (tree) diagram — a root with nested children. */
export interface TreeDiagramData {
  layout: 'tree';
  root: DiagramNode;
}

export type DiagramData = HubDiagramData | TreeDiagramData;

/** Animated preview layout shapes (mirrors PreviewSpec.layout). */
export type TemplateLayout =
  | 'radial'
  | 'hub-lr'
  | 'pipeline'
  | 'tree'
  | 'orbit'
  | 'cycle'
  | 'steps'
  | 'funnel'
  | 'pyramid'
  | 'quadrant'
  | 'columns'
  | 'timeline'
  | 'iceberg'
  | 'bars'
  | 'chart-line'
  | 'donut';
/** Animated preview motion styles (mirrors PreviewMode). */
export type TemplateMode = 'dots' | 'beams' | 'pulses' | 'arrows';

/**
 * Optional visual pinning for a template's animated preview. When present, the
 * deriver uses these instead of its slug-hash defaults — so curated "key
 * example" templates render the exact look they were designed with, and the
 * homepage thumbnail matches the detail page and the canvas.
 */
export interface TemplateStyle {
  layout?: TemplateLayout;
  mode?: TemplateMode;
  accent?: string;
  bg?: string;
}

export interface TemplateFaq {
  q: string;
  a: string;
}

/**
 * Flat, JSON-only template record. This is exactly what the catalog generator
 * emits and what `catalog.data.ts` stores.
 */
export interface RawTemplate {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  keywords: string[];
  layout: 'hub' | 'tree';
  centerLabel: string;
  centerIcon: IconKey;
  satellites: { label: string; icon: IconKey; value?: number; unit?: string }[];
  treeChildren?: {
    label: string;
    icon: IconKey;
    children?: { label: string; icon: IconKey }[];
  }[];
  faqs: TemplateFaq[];
  useCases: string[];
  category: string;
  categoryName: string;
  /** Optional pinned visual style (curated templates only). */
  style?: TemplateStyle;
}

/** Runtime template with the canvas diagram `data` assembled. */
export interface Template {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  categoryName: string;
  tags: string[];
  keywords: string[];
  layout: 'hub' | 'tree';
  /** Diagram payload loaded into the canvas editor. */
  data: DiagramData;
  faqs: TemplateFaq[];
  useCases: string[];
  /** Optional pinned visual style (curated templates only). */
  style?: TemplateStyle;
}

export interface CategoryMeta {
  /** URL slug, e.g. "architecture". */
  key: string;
  /** Full descriptive name, e.g. "System & Software Architecture". */
  name: string;
  /** Short nav/chip label, e.g. "Architecture". */
  label: string;
  /** One-line tagline shown on the hub and collection headers. */
  tagline: string;
  /** Longer SEO blurb for the collection page. */
  description: string;
  /** Accent color (hex) used for previews and chips. */
  accent: string;
}
