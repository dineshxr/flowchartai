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
  /** Which AnimatedPreview layout renders this structure. */
  layout: TemplateLayout;
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
    mode: 'arrows',
    accent: '#6366f1',
  },
  {
    key: 'data',
    label: 'Data',
    tagline: 'Quantitative or structured metrics.',
    structure:
      'The measurable facts: metrics, quantities, capabilities or attributes stated in the text. Put the number/value in the label when present (e.g. "200 partners").',
    layout: 'radial',
    mode: 'pulses',
    accent: '#14b8a6',
  },
  {
    key: 'timeline',
    label: 'Timelines',
    tagline: 'Chronological data mapping.',
    structure:
      'Chronological milestones IN ORDER (dates, releases, phases). Satellites must be ordered earliest → latest.',
    layout: 'pipeline',
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
    mode: 'dots',
    accent: '#ec4899',
  },
  {
    key: 'parts-of-whole',
    label: 'Parts of a Whole',
    tagline: 'Component-to-system relationships.',
    structure:
      'The components that together make up the whole described in the text.',
    layout: 'radial',
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
    mode: 'beams',
    accent: '#ef4444',
  },
  {
    key: 'visual-metaphor',
    label: 'Visual Metaphors',
    tagline: 'Abstract conceptual representation.',
    structure:
      "Pick ONE strong metaphor for the core idea (ladder, bridge, iceberg, engine…). Center is the metaphor; satellites map the text's ideas onto its parts.",
    layout: 'radial',
    mode: 'dots',
    accent: '#d946ef',
  },
  {
    key: 'narrative',
    label: 'Narrative',
    tagline: 'Sequential storytelling structure.',
    structure:
      'The story beats of the text IN ORDER: setup → development → resolution.',
    layout: 'pipeline',
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

// ---- Suggestion shape (what the AI returns, validated) ----------------------

export interface VisualSuggestionChild {
  label: string;
  icon: string;
}

export interface VisualSuggestionNode {
  label: string;
  icon: string;
  /** Only present for tree categories (hierarchy, business frameworks). */
  children?: VisualSuggestionChild[];
}

export interface VisualSuggestion {
  id: string;
  title: string;
  category: VisualCategoryKey;
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
    })),
  };
}
