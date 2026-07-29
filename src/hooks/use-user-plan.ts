'use client';

import type { PlanId } from '@/config/plans';
import { useEffect, useState } from 'react';

// Module-level cache so several mounts (badge in navbar + sidebar + cards)
// share one /api/me fetch instead of firing per component.
let cachedPlan: PlanId | null = null;
let inflight: Promise<PlanId> | null = null;

function fetchPlan(): Promise<PlanId> {
  if (cachedPlan) return Promise.resolve(cachedPlan);
  if (inflight) return inflight;
  inflight = fetch('/api/me')
    .then((r) => r.json())
    .then((d) => {
      const plan: PlanId =
        d?.plan === 'pro' || d?.plan === 'max' ? d.plan : 'free';
      cachedPlan = plan;
      return plan;
    })
    .catch(() => 'free' as PlanId)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/**
 * The signed-in user's plan, for client-side gating (canvas export resolution,
 * watermark, etc.). Defaults to 'free' until the fetch resolves — the safe
 * default, since free is the most-restricted tier.
 *
 * Pass `enabled: false` to skip fetching (e.g. when the caller already knows
 * the plan and only renders with it).
 */
export function useUserPlan(enabled = true): PlanId {
  const [plan, setPlan] = useState<PlanId>(cachedPlan ?? 'free');

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    fetchPlan().then((p) => {
      if (active) setPlan(p);
    });
    return () => {
      active = false;
    };
  }, [enabled]);

  return plan;
}
