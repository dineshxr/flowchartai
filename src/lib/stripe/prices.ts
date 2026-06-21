import type { PlanId } from '@/config/plans';

// Price ↔ plan mapping, env-driven and free of the Stripe SDK so cheap call
// sites (AI usage limits) can import it without bundling Stripe.

export type Interval = 'month' | 'year';
export type PaidPlan = Exclude<PlanId, 'free'>;

const PRICE_REFS: { plan: PaidPlan; interval: Interval; env: string }[] = [
  { plan: 'pro', interval: 'month', env: 'STRIPE_PRICE_PRO_MONTHLY' },
  { plan: 'pro', interval: 'year', env: 'STRIPE_PRICE_PRO_YEARLY' },
  { plan: 'max', interval: 'month', env: 'STRIPE_PRICE_MAX_MONTHLY' },
  { plan: 'max', interval: 'year', env: 'STRIPE_PRICE_MAX_YEARLY' },
];

/** Resolve the Stripe price ID for a plan + interval (or undefined if unset). */
export function priceIdFor(
  plan: PlanId,
  interval: Interval
): string | undefined {
  const ref = PRICE_REFS.find(
    (r) => r.plan === plan && r.interval === interval
  );
  return ref ? process.env[ref.env] : undefined;
}

/** Reverse lookup: which plan/interval does a Stripe price ID map to? */
export function planForPriceId(
  priceId: string | null | undefined
): { plan: PaidPlan; interval: Interval } | undefined {
  if (!priceId) return undefined;
  for (const r of PRICE_REFS) {
    if (process.env[r.env] && process.env[r.env] === priceId) {
      return { plan: r.plan, interval: r.interval };
    }
  }
  return undefined;
}
