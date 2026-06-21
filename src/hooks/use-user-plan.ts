'use client';

import type { PlanId } from '@/config/plans';
import { useEffect, useState } from 'react';

/**
 * The signed-in user's plan, for client-side gating (canvas export resolution,
 * watermark, etc.). Defaults to 'free' until the fetch resolves — the safe
 * default, since free is the most-restricted tier.
 */
export function useUserPlan(): PlanId {
  const [plan, setPlan] = useState<PlanId>('free');

  useEffect(() => {
    let active = true;
    fetch('/api/me')
      .then((r) => r.json())
      .then((d) => {
        if (
          active &&
          (d?.plan === 'pro' || d?.plan === 'max' || d?.plan === 'free')
        ) {
          setPlan(d.plan);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return plan;
}
