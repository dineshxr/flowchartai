// Shared types for the Infogiph template catalog.
//
// Two representations exist per template:
//  - `RawTemplate` is the flat shape produced by the catalog generator (and the
//    seed data). It is pure JSON — safe to import from server or client.
//  - `Template` is the runtime shape consumed by pages/components, with the
//    canvas `data` already assembled (hub or tree) so it can be loaded straight
//    into the editor at /canvas.

/**
 * Icon keys understood by both the canvas (`getIcon` in flowviz-architect.tsx)
 * and the preview deriver (`iconNodeFromKey` in preview.tsx). Keep this list in
 * sync with both mappers.
 */
export type IconKey =
  | 'bot'
  | 'database'
  | 'cloud'
  | 'web'
  | 'chat'
  | 'drive'
  | 'mobile'
  | 'mail'
  | 'search'
  | 'process'
  | 'automation'
  | 'social'
  | 'layers';

export const ICON_KEYS: IconKey[] = [
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
];

export interface DiagramNode {
  label: string;
  icon: IconKey;
  children?: DiagramNode[];
}

/** Hub-and-spoke diagram — a central node connected to satellites. */
export interface HubDiagramData {
  center: { label: string; icon: IconKey };
  satellites: { label: string; icon: IconKey }[];
}

/** Hierarchical (tree) diagram — a root with nested children. */
export interface TreeDiagramData {
  layout: 'tree';
  root: DiagramNode;
}

export type DiagramData = HubDiagramData | TreeDiagramData;

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
  satellites: { label: string; icon: IconKey }[];
  treeChildren?: {
    label: string;
    icon: IconKey;
    children?: { label: string; icon: IconKey }[];
  }[];
  faqs: TemplateFaq[];
  useCases: string[];
  category: string;
  categoryName: string;
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
