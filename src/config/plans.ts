// ─────────────────────────────────────────────────────────────────────────────
// Plan model — the single source of truth for the pricing page AND feature
// gating (AI credits, watermark, HD exports).
//
// The paid tiers differ from free on three axes: exports carry no watermark,
// HD (2×, 4K-class) exports are unlocked, and you get more AI generations.
// Formats and size presets stay identical on every plan — the quality gate is
// a single Standard/HD choice inside the export dialog, not a confusing
// resolution matrix.
//
// Price IDs are resolved from env at request time (see src/lib/stripe/prices.ts),
// not from this file.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanId = 'free' | 'pro' | 'max';

export interface PlanLimits {
  /** AI generations allowed; 'unlimited' for the top tier. */
  aiGenerations: number | 'unlimited';
  /** Whether the credit allowance resets monthly or is a one-time lifetime grant. */
  aiPeriod: 'lifetime' | 'month';
  /** Exports allowed. Unlimited on every plan — the watermark is the free-tier
   *  constraint, not a download cap. */
  exports: number | 'unlimited';
  /** Whether exports carry the "infogiph.com" watermark. */
  watermark: boolean;
  /** Whether HD (2× / 4K-class) export resolution is unlocked. */
  hdExport: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** USD / month (0 for free). */
  priceMonthly: number;
  /** USD / month when billed yearly (0 for free). */
  priceYearlyMonthly: number;
  badge?: string;
  highlight?: boolean;
  cta: string;
  limits: PlanLimits;
  /** Bullet points shown on the pricing card. */
  features: string[];
  // ── Stripe (wired later) ──
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Try Infogiph and ship your first diagram.',
    priceMonthly: 0,
    priceYearlyMonthly: 0,
    cta: 'Start free',
    limits: {
      aiGenerations: 5,
      aiPeriod: 'lifetime',
      exports: 'unlimited',
      watermark: true,
      hdExport: false,
    },
    features: [
      '5 AI generations (lifetime)',
      'Unlimited exports',
      'All 106 templates & the full editor',
      'GIF, MP4, PNG & SVG export (1080p-class)',
      'Infogiph watermark on exports',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For creators who ship infographics every week.',
    priceMonthly: 12,
    priceYearlyMonthly: 9,
    badge: 'Most popular',
    highlight: true,
    cta: 'Upgrade to Pro',
    limits: {
      aiGenerations: 500,
      aiPeriod: 'month',
      exports: 'unlimited',
      watermark: false,
      hdExport: true,
    },
    features: [
      'No watermark on any export',
      'HD 2× exports (4K-class MP4 & PNG)',
      '500 AI generations / month',
      'Unlimited exports',
      'Priority AI generation',
      'Commercial usage license',
    ],
  },
  {
    id: 'max',
    name: 'Max',
    tagline: 'Everything, uncapped — for teams and power users.',
    priceMonthly: 29,
    priceYearlyMonthly: 23,
    badge: 'Best value',
    cta: 'Go Max',
    limits: {
      aiGenerations: 'unlimited',
      aiPeriod: 'month',
      exports: 'unlimited',
      watermark: false,
      hdExport: true,
    },
    features: [
      'Unlimited AI generations',
      'Everything in Pro',
      'Brand kit — your logo, colors & custom watermark',
      'Team workspace & shared diagrams',
      'Priority support',
      'Early access + API',
    ],
  },
];

export const PLAN_BY_ID: Record<PlanId, Plan> = PLANS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<PlanId, Plan>
);

const PLAN_RANK: Record<PlanId, number> = { free: 0, pro: 1, max: 2 };

export function planRank(id: PlanId): number {
  return PLAN_RANK[id] ?? 0;
}

/** The headline value props, shown in the upgrade dialog and the export modal. */
export const UPGRADE_VALUE_PROPS: {
  icon: 'sparkles' | 'image-off' | 'gauge' | 'film' | 'palette' | 'badge';
  title: string;
  desc: string;
}[] = [
  {
    icon: 'image-off',
    title: 'No watermark',
    desc: 'Clean, professional exports with no “infogiph.com” badge.',
  },
  {
    icon: 'film',
    title: 'HD 2× exports',
    desc: '4K-class MP4 and razor-sharp PNG for decks and print.',
  },
  {
    icon: 'sparkles',
    title: 'More AI generations',
    desc: '500 generations / month on Pro — unlimited on Max.',
  },
  {
    icon: 'gauge',
    title: 'Priority generation',
    desc: 'Your diagrams are generated first in the queue.',
  },
  {
    icon: 'badge',
    title: 'Commercial license',
    desc: 'Use everything you make in client and commercial work.',
  },
];
