'use client';

// Homepage showcase data. Each card is DERIVED from a real catalog template via
// the same `derivePreviewSpec` used by the /templates detail page and the
// /canvas editor — so the thumbnail a user sees here is exactly what they get
// when they click through. No more "the template doesn't match the preview".
//
// We only choose the bento sizing (hero / wide / square / tall) here; the
// diagram itself — icons, layout, animation, colours — comes from the curated
// template data in src/lib/templates/curated.data.ts.

import { accentForCategory, getTemplateBySlug } from '@/lib/templates/catalog';
import { derivePreviewSpec } from '@/lib/templates/preview';
import {
  type Dims,
  type PreviewSpec,
  SQUARE_DIMS,
  TALL_DIMS,
  WIDE_DIMS,
} from './animated-preview';

export interface ShowcaseItem {
  key: string;
  title: string;
  desc: string;
  /** Real /templates detail page this card opens. */
  href: string;
  /** Bento role: feature band vs. masonry cell shape. */
  size: 'hero' | 'wide' | 'square' | 'tall';
  dims: Dims;
  spec: PreviewSpec;
}

type Size = ShowcaseItem['size'];

const dimsForSize = (size: Size): Dims =>
  size === 'tall' ? TALL_DIMS : size === 'square' ? SQUARE_DIMS : WIDE_DIMS;

/** Short, punchy card subtitles (the catalog shortDescription can be long). */
const DESCS: Record<string, string> = {
  'how-llms-work-diagram': 'Prompt → tokens → transformer → answer',
  'claude-code-architecture-diagram': 'Terminal agent, MCP tools & your repo',
  'codex-architecture-diagram': 'Plans, writes & tests code in a sandbox',
  'aws-cloud-architecture-diagram': 'Compute, containers, data & CDN on AWS',
  'supply-chain-diagram': 'Suppliers, ERP, logistics & retail',
  'ai-agent-architecture-diagram': 'Autonomous agent with tools & memory',
  'microservices-architecture-diagram': 'Gateway, services, data & payments',
  'kubernetes-architecture-diagram': 'Pods, control plane & ingress',
  'zero-trust-architecture-diagram': 'Verify every request, trust no network',
  'ci-cd-pipeline-diagram': 'Commit → build → ship, automatically',
  'marketing-funnel-diagram': 'Turn reach into signups across channels',
  'org-chart-template': 'Reporting lines across the company',
  'payment-processing-flow-diagram': 'Checkout, gateway, ledger & payout',
  'serverless-architecture-template': 'Functions, auth & managed data',
  'learning-path-diagram': 'A structured route from basics to mastery',
  'ai-tool-ecosystem-orbit': 'Models & tools revolving around your stack',
  'saas-integration-orbit': 'Slack, Stripe & friends orbiting your product',
  'social-media-ecosystem-orbit': 'Every channel circling your brand',
  'github-stars-growth-chart': 'The up-and-to-the-right chart, animated',
  'quarterly-results-bar-chart': 'Value-driven bars with a living pulse',
  'browser-market-share-donut': 'Who owns the market, slice by slice',
};

function build(slug: string, size: Size): ShowcaseItem | null {
  const t = getTemplateBySlug(slug);
  if (!t) return null;
  const spec = derivePreviewSpec(t, accentForCategory(t.category));
  return {
    key: slug,
    title: t.title,
    desc: DESCS[slug] || t.shortDescription,
    href: `/templates/${t.category}/${t.slug}`,
    size,
    dims: dimsForSize(size),
    spec,
  };
}

const compact = (items: (ShowcaseItem | null)[]): ShowcaseItem[] =>
  items.filter((x): x is ShowcaseItem => x !== null);

/** Big, brand-rich "key examples" rendered as a feature band. */
export const showcaseHeroes: ShowcaseItem[] = compact([
  build('how-llms-work-diagram', 'hero'),
  build('claude-code-architecture-diagram', 'hero'),
  build('codex-architecture-diagram', 'hero'),
]);

/** The varied-size animated gallery beneath the heroes. */
export const showcaseGallery: ShowcaseItem[] = compact([
  build('aws-cloud-architecture-diagram', 'wide'),
  build('ai-tool-ecosystem-orbit', 'square'),
  build('github-stars-growth-chart', 'wide'),
  build('supply-chain-diagram', 'wide'),
  build('ai-agent-architecture-diagram', 'square'),
  build('quarterly-results-bar-chart', 'wide'),
  build('microservices-architecture-diagram', 'wide'),
  build('kubernetes-architecture-diagram', 'square'),
  build('org-chart-template', 'tall'),
  build('browser-market-share-donut', 'square'),
  build('saas-integration-orbit', 'wide'),
  build('zero-trust-architecture-diagram', 'square'),
  build('ci-cd-pipeline-diagram', 'wide'),
  build('marketing-funnel-diagram', 'wide'),
  build('social-media-ecosystem-orbit', 'square'),
  build('payment-processing-flow-diagram', 'square'),
  build('learning-path-diagram', 'tall'),
  build('serverless-architecture-template', 'wide'),
]);
