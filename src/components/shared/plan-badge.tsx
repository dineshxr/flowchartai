'use client';

import type { PlanId } from '@/config/plans';
import { useUserPlan } from '@/hooks/use-user-plan';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';

const STYLES: Record<PlanId, string> = {
  free: 'border border-border bg-muted text-muted-foreground',
  pro: 'border border-blue-200 bg-blue-50 text-blue-700',
  max: 'border border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700',
};

const LABELS: Record<PlanId, string> = {
  free: 'Free',
  pro: 'Pro',
  max: 'Max',
};

/**
 * Tiny plan-tier badge (Free / Pro / Max) for profile surfaces. Pass `plan`
 * when the caller already knows it; otherwise it resolves the signed-in
 * user's plan itself via /api/me.
 */
export function PlanBadge({
  plan,
  className,
}: {
  plan?: PlanId;
  className?: string;
}) {
  const fetchedPlan = useUserPlan(plan === undefined);
  const effective = plan ?? fetchedPlan;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        STYLES[effective],
        className
      )}
    >
      {effective === 'max' && <Crown className="h-3 w-3" />}
      {LABELS[effective]}
    </span>
  );
}
