// ─────────────────────────────────────────────────────────────────────────────
// Plan model — the single source of truth for the pricing page AND feature
// gating (AI credits, exports, watermark, resolution).
//
// Payments are wired later (Stripe). The `stripePriceId*` fields are
// placeholders; nothing here calls a payment provider. Amounts are easy to
// change — they live only in this file.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanId = 'free' | 'pro' | 'max';
export type ResolutionTier = '1080p' | '2k' | '4k';

export interface PlanLimits {
  /** AI generations allowed; 'unlimited' for the top tier. */
  aiGenerations: number | 'unlimited';
  /** Whether the credit allowance resets monthly or is a one-time lifetime grant. */
  aiPeriod: 'lifetime' | 'month';
  /** Exports allowed; 'unlimited' for paid. */
  exports: number | 'unlimited';
  /** Whether exports carry the "infogiph.com" watermark. */
  watermark: boolean;
  /** Highest export resolution this plan can produce. */
  maxResolution: ResolutionTier;
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
      exports: 5,
      watermark: true,
      maxResolution: '1080p',
    },
    features: [
      '5 AI generations (lifetime)',
      '5 exports',
      'All 98 templates & the full editor',
      'PNG, SVG, GIF & MP4 export',
      '1080p resolution',
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
      maxResolution: '4k',
    },
    features: [
      '500 AI generations / month',
      'Unlimited exports',
      'No watermark',
      '2K & 4K video, GIF & image export',
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
      maxResolution: '4k',
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

// ── Export resolutions ──────────────────────────────────────────────────────

export interface ResolutionOption {
  id: ResolutionTier;
  label: string;
  /** Short descriptor, e.g. "Full HD". */
  note: string;
  /** Multiplier applied to the base (~1080p) export dimensions. */
  scale: number;
  /** Minimum plan that can produce this resolution. */
  minPlan: PlanId;
}

export const RESOLUTIONS: ResolutionOption[] = [
  { id: '1080p', label: '1080p', note: 'Full HD', scale: 1, minPlan: 'free' },
  { id: '2k', label: '2K', note: 'QHD · sharp', scale: 1.34, minPlan: 'pro' },
  { id: '4k', label: '4K', note: 'Ultra HD', scale: 2, minPlan: 'pro' },
];

export const RESOLUTION_BY_ID: Record<ResolutionTier, ResolutionOption> =
  RESOLUTIONS.reduce(
    (acc, r) => {
      acc[r.id] = r;
      return acc;
    },
    {} as Record<ResolutionTier, ResolutionOption>
  );

/** Can a plan export at the given resolution? */
export function canUseResolution(
  plan: PlanId,
  resolution: ResolutionTier
): boolean {
  return planRank(plan) >= planRank(RESOLUTION_BY_ID[resolution].minPlan);
}

/** The headline value props, shown in the upgrade dialog. */
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
    title: '2K & 4K video and GIF',
    desc: 'Crisp, high-resolution MP4 and GIF for any screen or deck.',
  },
  {
    icon: 'sparkles',
    title: 'Up to unlimited AI',
    desc: '500 generations / month on Pro — unlimited on Max.',
  },
  {
    icon: 'gauge',
    title: 'Unlimited exports + priority',
    desc: 'Export as much as you want, generated first in the queue.',
  },
];
