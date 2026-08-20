// The Infogiph template catalog: category metadata, the raw->runtime transform,
// and lookup/filtering helpers. Pure data only (no JSX) so it can be imported
// from server components, client components, and the sitemap alike.

import { rawTemplates } from './catalog.data';
import { curatedOverrides, curatedTemplates } from './curated.data';
import type {
  CategoryMeta,
  DiagramData,
  RawTemplate,
  Template,
  TreeDiagramData,
} from './types';

/** Narrowing guard: is this diagram a hierarchical (tree) layout? */
export function isTreeData(data: DiagramData): data is TreeDiagramData {
  return 'layout' in data && data.layout === 'tree';
}

export const categories: CategoryMeta[] = [
  {
    key: 'architecture',
    name: 'System & Software Architecture',
    label: 'Architecture',
    tagline: 'Map systems, services, and how they connect.',
    description:
      'Editable system and software architecture diagram templates — microservices, serverless, event-driven, API gateways, and more. Start from a proven blueprint and adapt it to your stack.',
    accent: '#8b5cf6',
  },
  {
    key: 'data',
    name: 'Data & Analytics',
    label: 'Data & Analytics',
    tagline: 'Pipelines, warehouses, and analytics flows.',
    description:
      'Data engineering and analytics diagram templates covering ETL pipelines, data warehouses, streaming, data lakes, and BI stacks — ready to customise for your data platform.',
    accent: '#14b8a6',
  },
  {
    key: 'ai-ml',
    name: 'AI & Machine Learning',
    label: 'AI & ML',
    tagline: 'Agents, RAG, and ML pipelines visualised.',
    description:
      'AI and machine learning architecture templates — RAG systems, AI agents, ML training pipelines, LLM apps, and MLOps flows. Turn a complex AI stack into a clear, shareable diagram.',
    accent: '#6366f1',
  },
  {
    key: 'business',
    name: 'Business & Strategy',
    label: 'Business',
    tagline: 'Models, value chains, and strategy maps.',
    description:
      'Business and strategy diagram templates — business model canvases, value chains, go-to-market plans, supply chains, and OKR maps to align teams and stakeholders.',
    accent: '#f59e0b',
  },
  {
    key: 'marketing',
    name: 'Marketing & Growth',
    label: 'Marketing',
    tagline: 'Funnels, campaigns, and growth loops.',
    description:
      'Marketing and growth diagram templates — marketing funnels, content workflows, email automation, growth loops, and campaign flows that make your strategy easy to share.',
    accent: '#ec4899',
  },
  {
    key: 'sales-crm',
    name: 'Sales & CRM',
    label: 'Sales & CRM',
    tagline: 'Pipelines, journeys, and CRM flows.',
    description:
      'Sales and CRM diagram templates — sales pipelines, lead flows, customer journeys, and CRM architectures to visualise how deals move and where customers convert.',
    accent: '#ef4444',
  },
  {
    key: 'product',
    name: 'Product & UX',
    label: 'Product',
    tagline: 'Roadmaps, user flows, and journeys.',
    description:
      'Product and UX diagram templates — product roadmaps, onboarding flows, user journeys, design systems, and feature flows to plan and communicate product work.',
    accent: '#0ea5e9',
  },
  {
    key: 'devops-cloud',
    name: 'DevOps & Cloud',
    label: 'DevOps',
    tagline: 'CI/CD, Kubernetes, and cloud infra.',
    description:
      'DevOps and cloud diagram templates — CI/CD pipelines, Kubernetes architectures, deployment flows, GitOps, and monitoring stacks for modern infrastructure.',
    accent: '#22c55e',
  },
  {
    key: 'security',
    name: 'Security & Identity',
    label: 'Security',
    tagline: 'Auth, zero-trust, and incident response.',
    description:
      'Security and identity diagram templates — OAuth flows, zero-trust architectures, SSO, incident response, and threat models to document how your systems stay safe.',
    accent: '#06b6d4',
  },
  {
    key: 'finance',
    name: 'Finance & Fintech',
    label: 'Finance',
    tagline: 'Payments, fintech, and money flows.',
    description:
      'Finance and fintech diagram templates — payment processing, fintech architectures, invoicing, expense approvals, and trading systems to map how money moves.',
    accent: '#10b981',
  },
  {
    key: 'org-people',
    name: 'Org & People',
    label: 'Org & People',
    tagline: 'Org charts, teams, and hiring flows.',
    description:
      'Org and people diagram templates — org charts, hiring pipelines, onboarding flows, team structures, and reporting lines to show how your organisation works.',
    accent: '#f97316',
  },
  {
    key: 'process',
    name: 'Process & Workflow',
    label: 'Process',
    tagline: 'Approvals, workflows, and decision trees.',
    description:
      'Process and workflow diagram templates — approval workflows, order fulfilment, support flows, incident management, and decision trees to standardise how work gets done.',
    accent: '#a855f7',
  },
  {
    key: 'education',
    name: 'Education & Learning',
    label: 'Education',
    tagline: 'Learning paths, curricula, and concept maps.',
    description:
      'Education and learning diagram templates — learning paths, curriculum maps, concept maps, and course structures to plan teaching and visualise knowledge.',
    accent: '#3b82f6',
  },
  {
    key: 'healthcare',
    name: 'Healthcare & Life Sciences',
    label: 'Healthcare',
    tagline: 'Patient journeys and clinical workflows.',
    description:
      'Healthcare and life sciences diagram templates — patient journeys, clinical workflows, telehealth architectures, and EHR systems to document care and operations.',
    accent: '#e11d48',
  },
  {
    key: 'charts',
    name: 'Charts & Data Visualization',
    label: 'Charts & Data',
    tagline: 'Animated bar, line, and donut charts.',
    description:
      'Animated chart templates — bar charts, trend lines, donut and share-of-total charts with editable values, labels and real brand logos. Turn metrics into shareable animated visuals and export them as GIF or MP4.',
    accent: '#f43f5e',
  },
];

const categoryByKey = new Map(categories.map((c) => [c.key, c]));

export function getCategory(key: string): CategoryMeta | undefined {
  return categoryByKey.get(key);
}

export function accentForCategory(key: string): string {
  return categoryByKey.get(key)?.accent || '#8b5cf6';
}

/** Assemble the canvas-ready diagram payload from a flat raw template. */
function toDiagramData(raw: RawTemplate): DiagramData {
  if (
    raw.layout === 'tree' &&
    raw.treeChildren &&
    raw.treeChildren.length > 0
  ) {
    return {
      layout: 'tree',
      root: {
        label: raw.centerLabel,
        icon: raw.centerIcon,
        children: raw.treeChildren.map((c) => ({
          label: c.label,
          icon: c.icon,
          children: (c.children || []).map((g) => ({
            label: g.label,
            icon: g.icon,
          })),
        })),
      },
    };
  }
  return {
    center: { label: raw.centerLabel, icon: raw.centerIcon },
    satellites: raw.satellites.map((s) => ({
      label: s.label,
      icon: s.icon,
      value: s.value,
      unit: s.unit,
    })),
  };
}

function toTemplate(raw: RawTemplate): Template {
  return {
    slug: raw.slug,
    title: raw.title,
    shortDescription: raw.shortDescription,
    longDescription: raw.longDescription,
    category: raw.category,
    categoryName: raw.categoryName,
    tags: raw.tags,
    keywords: raw.keywords,
    layout: raw.layout,
    data: toDiagramData(raw),
    faqs: raw.faqs,
    useCases: raw.useCases,
    style: raw.style,
    pro: raw.pro,
  };
}

/**
 * Apply a curated override (richer diagram + pinned style) onto a base catalog
 * template, keeping its SEO copy. Only the keys present in the override replace
 * the base, so the original title/description/FAQs are preserved.
 */
function applyOverride(raw: RawTemplate): RawTemplate {
  const ov = curatedOverrides[raw.slug];
  return ov ? ({ ...raw, ...ov } as RawTemplate) : raw;
}

// Curated full templates lead the list (so they head their category pages),
// followed by the auto-generated catalog with any rich overrides applied.
export const allTemplates: Template[] = [
  ...curatedTemplates,
  ...rawTemplates.map(applyOverride),
].map(toTemplate);

const templateBySlug = new Map(allTemplates.map((t) => [t.slug, t]));

export function getTemplateBySlug(slug: string): Template | undefined {
  return templateBySlug.get(slug);
}

export function getTemplatesByCategory(key: string): Template[] {
  return allTemplates.filter((t) => t.category === key);
}

/** Categories that actually have at least one template, in catalog order. */
export function getActiveCategories(): CategoryMeta[] {
  return categories.filter((c) =>
    allTemplates.some((t) => t.category === c.key)
  );
}

export function getCategoryCount(key: string): number {
  return allTemplates.reduce((n, t) => (t.category === key ? n + 1 : n), 0);
}

/**
 * Related templates: same-category neighbours first, then fill from other
 * categories so a detail page always has a full row of suggestions.
 */
export function getRelatedTemplates(template: Template, n = 6): Template[] {
  const sameCategory = allTemplates.filter(
    (t) => t.category === template.category && t.slug !== template.slug
  );
  const others = allTemplates.filter(
    (t) => t.category !== template.category && t.slug !== template.slug
  );
  return [...sameCategory, ...others].slice(0, n);
}

/** Plain-text seed describing a template, used to prime AI regeneration in the canvas. */
export function templateTopicSeed(template: Template): string {
  const data = template.data;
  if (isTreeData(data)) {
    const parts = (data.root.children || []).map((c) => c.label);
    return `${template.title}: ${data.root.label} with ${parts.join(', ')}`;
  }
  const parts = data.satellites.map((s) => s.label);
  return `${template.title}: ${data.center.label} with ${parts.join(', ')}`;
}
