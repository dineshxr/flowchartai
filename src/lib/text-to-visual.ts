// "Text to visuals" (long-form text → suggested diagrams), Napkin-style.
//
// Pure data + types shared by the API route (prompt construction, validation)
// and the canvas panel (category list, layout mapping, DiagramData assembly).
// No JSX here so it stays importable from server code.

import type {
  DiagramData,
  TemplateLayout,
  TemplateMode,
} from './templates/types';

export type VisualOrientation = 'portrait' | 'auto' | 'landscape';
export type VisualIllustration = 'abstract' | 'auto' | 'concrete';
export type VisualDetail = 'summary' | 'auto' | 'detailed';

export type VisualCategoryKey =
  | 'mindmap'
  | 'process'
  | 'data'
  | 'timeline'
  | 'comparison'
  | 'business-framework'
  | 'brainstorming'
  | 'parts-of-whole'
  | 'problems-solutions'
  | 'visual-metaphor'
  | 'narrative'
  | 'cause-effect'
  | 'hierarchy'
  | 'ecosystem';

export interface VisualCategory {
  key: VisualCategoryKey;
  label: string;
  /** One-line description shown in the categories list. */
  tagline: string;
  /**
   * Prompt guidance: what structure the model should extract from the text
   * when it builds a suggestion in this category.
   */
  structure: string;
  /** Primary AnimatedPreview layout for this structure (= variants[0]). */
  layout: TemplateLayout;
  /**
   * Ordered shape variants this category can render as — the same extracted
   * content shown as genuinely different structures (Napkin-style). Primary
   * first; assignVariantLayouts walks this list.
   */
  variants: TemplateLayout[];
  /** Animation flavor that suits the structure. */
  mode: TemplateMode;
  accent: string;
}

export const VISUAL_CATEGORIES: VisualCategory[] = [
  {
    key: 'mindmap',
    label: 'Mindmap',
    tagline: 'Associative networking of concepts.',
    structure:
      'One central concept with the key associated ideas radiating around it.',
    layout: 'radial',
    variants: ['radial', 'hub-lr', 'tree', 'orbit'],
    mode: 'dots',
    accent: '#8b5cf6',
  },
  {
    key: 'process',
    label: 'Process',
    tagline: 'Sequential or algorithmic steps.',
    structure:
      'The sequential steps of the process IN ORDER. Satellites must be ordered step 1 → step N.',
    layout: 'pipeline',
    variants: ['pipeline', 'steps', 'iso-steps', 'cycle', 'timeline'],
    mode: 'arrows',
    accent: '#6366f1',
  },
  {
    key: 'data',
    label: 'Data',
    tagline: 'Quantitative or structured metrics.',
    structure:
      'The measurable facts: metrics, quantities or attributes stated in the text. Put each number in the satellite\'s `value` field (plain number) with its `unit` ("%", "$", "k", "users"…), keeping the label short (e.g. label "Partners", value 200). Comparable magnitudes → bars; a series over time → chart-line; shares of a whole → donut.',
    layout: 'bars',
    variants: ['bars', 'donut', 'chart-line', 'radial', 'columns', 'quadrant'],
    mode: 'pulses',
    accent: '#14b8a6',
  },
  {
    key: 'timeline',
    label: 'Timelines',
    tagline: 'Chronological data mapping.',
    structure:
      'Chronological milestones IN ORDER (dates, releases, phases). Satellites must be ordered earliest → latest.',
    layout: 'timeline',
    variants: ['timeline', 'pipeline', 'steps', 'cycle', 'chart-line'],
    mode: 'arrows',
    accent: '#0ea5e9',
  },
  {
    key: 'comparison',
    label: 'Comparison',
    tagline: 'Contrasting variable attributes.',
    structure:
      'Two things being contrasted. Use an EVEN satellite count: the first half describes side A, the second half describes side B, in matching order. Center names the comparison axis.',
    layout: 'hub-lr',
    variants: ['hub-lr', 'columns', 'quadrant', 'bars'],
    mode: 'beams',
    accent: '#f59e0b',
  },
  {
    key: 'business-framework',
    label: 'Business Frameworks',
    tagline: 'Standardized strategy models.',
    structure:
      'A standard strategy framework fitting the text (SWOT, funnel, 4P, flywheel…). Satellites are the framework pillars; give each 2-3 children with the concrete points from the text.',
    layout: 'tree',
    variants: ['tree'],
    mode: 'pulses',
    accent: '#10b981',
  },
  {
    key: 'brainstorming',
    label: 'Brainstorming',
    tagline: 'Ideas in motion around a theme.',
    structure:
      'Divergent ideas, options or angles suggested by the text, orbiting the central theme.',
    layout: 'orbit',
    variants: ['orbit', 'radial', 'quadrant', 'columns'],
    mode: 'dots',
    accent: '#ec4899',
  },
  {
    key: 'parts-of-whole',
    label: 'Parts of a Whole',
    tagline: 'Component-to-system relationships.',
    structure:
      'The components that together make up the whole described in the text. Order satellites most visible/surface-level first, deepest/most foundational last.',
    layout: 'radial',
    variants: ['radial', 'pyramid', 'iceberg', 'columns'],
    mode: 'pulses',
    accent: '#f97316',
  },
  {
    key: 'problems-solutions',
    label: 'Problems & Solutions',
    tagline: 'Issue-to-resolution mapping.',
    structure:
      'Use an EVEN satellite count: the first half are the problems/risks, the second half the matching solutions/safeguards, in the same order. Center names the tension.',
    layout: 'hub-lr',
    variants: ['hub-lr', 'columns', 'iceberg', 'cycle'],
    mode: 'beams',
    accent: '#ef4444',
  },
  {
    key: 'visual-metaphor',
    label: 'Visual Metaphors',
    tagline: 'Abstract conceptual representation.',
    structure:
      "Pick ONE strong metaphor for the core idea that maps to a supported shape — iceberg (hidden depth), steps/ladder (climb), funnel (narrowing), pyramid (foundation), cycle/flywheel (loop). Center is the metaphor; satellites map the text's ideas onto its parts, ordered surface-first for iceberg and bottom-first for pyramid.",
    layout: 'iceberg',
    variants: [
      'iceberg',
      'steps',
      'iso-steps',
      'pyramid',
      'funnel',
      'cycle',
      'radial',
    ],
    mode: 'pulses',
    accent: '#d946ef',
  },
  {
    key: 'narrative',
    label: 'Narrative',
    tagline: 'Sequential storytelling structure.',
    structure:
      'The story beats of the text IN ORDER: setup → development → resolution.',
    layout: 'pipeline',
    variants: ['pipeline', 'steps', 'timeline', 'cycle'],
    mode: 'arrows',
    accent: '#3b82f6',
  },
  {
    key: 'cause-effect',
    label: 'Cause & Effect',
    tagline: 'Dependency and outcome tracking.',
    structure:
      'The causal chain: causes first, then their effects/outcomes, ordered cause → effect.',
    layout: 'pipeline',
    variants: ['pipeline', 'funnel', 'cycle', 'hub-lr'],
    mode: 'beams',
    accent: '#06b6d4',
  },
  {
    key: 'hierarchy',
    label: 'Hierarchy',
    tagline: 'Tree-based classification and ranking.',
    structure:
      'A classification tree: satellites are the top-level groups; give each 2-3 children with the specific items from the text.',
    layout: 'tree',
    variants: ['tree'],
    mode: 'pulses',
    accent: '#71717a',
  },
  {
    key: 'ecosystem',
    label: 'Ecosystem',
    tagline: 'A core platform and everything orbiting it.',
    structure:
      'The central platform, product or actor, with the tools, services or players that revolve around it as satellites. Name real products/companies where the text does, so their logos render.',
    layout: 'orbit',
    variants: ['orbit', 'radial', 'hub-lr', 'columns'],
    mode: 'beams',
    accent: '#0ea5e9',
  },
];

const CATEGORY_BY_KEY = new Map(VISUAL_CATEGORIES.map((c) => [c.key, c]));

export function getVisualCategory(key: string): VisualCategory | undefined {
  return CATEGORY_BY_KEY.get(key as VisualCategoryKey);
}

/** Categories whose satellites carry nested children (rendered as trees). */
export function isTreeCategory(key: VisualCategoryKey): boolean {
  return CATEGORY_BY_KEY.get(key)?.layout === 'tree';
}

/**
 * Animation flavor when a suggestion renders as a NON-primary shape variant
 * (the category's own mode applies to its primary layout).
 */
export const VARIANT_MODE: Partial<Record<TemplateLayout, TemplateMode>> = {
  timeline: 'arrows',
  cycle: 'arrows',
  steps: 'dots',
  funnel: 'dots',
  pyramid: 'pulses',
  quadrant: 'pulses',
  columns: 'beams',
  iceberg: 'pulses',
  'iso-steps': 'pulses',
  bars: 'pulses',
  'chart-line': 'beams',
  donut: 'pulses',
};

/** Effective mode for a suggestion rendered in `layout`. */
export function modeForLayout(
  cat: VisualCategory,
  layout: TemplateLayout
): TemplateMode {
  return layout === cat.layout ? cat.mode : (VARIANT_MODE[layout] ?? cat.mode);
}

/**
 * Can `layout` legibly render N flat satellites? Group shapes need enough
 * members; banded shapes become unreadable past 6 layers.
 */
export function isLayoutEligible(layout: TemplateLayout, n: number): boolean {
  switch (layout) {
    case 'quadrant':
    case 'iceberg':
    case 'columns':
      return n >= 4;
    case 'pyramid':
    case 'funnel':
    case 'steps':
      return n >= 3 && n <= 6;
    case 'iso-steps':
      return n >= 3 && n <= 15;
    case 'bars':
      return n >= 2 && n <= 8;
    case 'chart-line':
      return n >= 3 && n <= 8;
    case 'donut':
      return n >= 2 && n <= 6;
    default:
      return true;
  }
}

/**
 * Pick a shape variant per suggestion so a batch shows genuinely different
 * structures (the Napkin UX). Resolution order:
 *  1. the AI's `shape` hint, when it's an eligible variant of the category;
 *  2. category-targeted batches (all same category): round-robin the
 *     category's variant list — same content, different shapes;
 *  3. auto batches: each takes its category primary, advancing past layouts
 *     already used by earlier suggestions so 6 cards ≈ 6 silhouettes.
 */
export function assignVariantLayouts(
  suggestions: VisualSuggestion[]
): Map<string, TemplateLayout> {
  const out = new Map<string, TemplateLayout>();
  const used = new Set<TemplateLayout>();
  const cursor = new Map<string, number>();
  const sameCategory =
    suggestions.length > 1 &&
    suggestions.every((s) => s.category === suggestions[0].category);

  for (const s of suggestions) {
    const cat = getVisualCategory(s.category);
    const variants: TemplateLayout[] = cat?.variants?.length
      ? cat.variants
      : [cat?.layout ?? 'radial'];
    const n = s.satellites.length;
    let pick: TemplateLayout | undefined;

    if (s.shape && variants.includes(s.shape) && isLayoutEligible(s.shape, n)) {
      pick = s.shape;
    }
    if (!pick && sameCategory) {
      const start = cursor.get(s.category) ?? 0;
      for (let t = 0; t < variants.length; t++) {
        const cand = variants[(start + t) % variants.length];
        if (isLayoutEligible(cand, n)) {
          pick = cand;
          cursor.set(s.category, start + t + 1);
          break;
        }
      }
    }
    if (!pick) {
      pick =
        variants.find((v) => isLayoutEligible(v, n) && !used.has(v)) ??
        variants.find((v) => isLayoutEligible(v, n)) ??
        cat?.layout ??
        'radial';
    }
    used.add(pick);
    out.set(s.id, pick);
  }
  return out;
}

// ---- Suggestion shape (what the AI returns, validated) ----------------------

export interface VisualSuggestionChild {
  label: string;
  icon: string;
}

export interface VisualSuggestionNode {
  label: string;
  icon: string;
  /** Numeric magnitude for chart layouts (bars / chart-line / donut). */
  value?: number;
  /** Display unit for `value` — "%", "$", "k", "users"… */
  unit?: string;
  /** Only present for tree categories (hierarchy, business frameworks). */
  children?: VisualSuggestionChild[];
}

export interface VisualSuggestion {
  id: string;
  title: string;
  category: VisualCategoryKey;
  /** Optional AI shape hint (visual-metaphor: which metaphor shape fits). */
  shape?: TemplateLayout;
  center: { label: string; icon: string };
  satellites: VisualSuggestionNode[];
}

export interface TextToVisualParams {
  text: string;
  /** Restrict generation to one category (from the categories list). */
  category?: VisualCategoryKey;
  orientation?: VisualOrientation;
  illustration?: VisualIllustration;
  detail?: VisualDetail;
}

/**
 * Assemble the canvas-persistable DiagramData for a suggestion. Tree categories
 * become a real tree (so saved flowcharts reload with their hierarchy); all
 * others persist as hub data and re-render through their category's layout.
 */
export function suggestionToDiagramData(s: VisualSuggestion): DiagramData {
  if (isTreeCategory(s.category)) {
    return {
      layout: 'tree',
      root: {
        label: s.center.label,
        icon: s.center.icon,
        children: s.satellites.map((sat) => ({
          label: sat.label,
          icon: sat.icon,
          children: (sat.children || []).map((c) => ({
            label: c.label,
            icon: c.icon,
          })),
        })),
      },
    };
  }
  return {
    center: { label: s.center.label, icon: s.center.icon },
    satellites: s.satellites.map((sat) => ({
      label: sat.label,
      icon: sat.icon,
      value: sat.value,
      unit: sat.unit,
    })),
  };
}
