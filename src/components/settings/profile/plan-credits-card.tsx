'use client';

import { PlanBadge } from '@/components/shared/plan-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAIUsageLimit } from '@/hooks/use-ai-usage-limit';
import { LocaleLink } from '@/i18n/navigation';
import { Sparkles } from 'lucide-react';

const PLAN_IDS = {
  free: 'free',
  hobby: 'pro',
  professional: 'max',
} as const;

/**
 * Plan & AI-credits card for the profile settings page: which plan the user
 * is on, how many generations remain, and where to upgrade or manage billing.
 */
export function PlanCreditsCard({ className }: { className?: string }) {
  const { usageData, isLoading } = useAIUsageLimit();

  const plan = usageData?.subscriptionStatus ?? 'free';
  const isUnlimited = plan === 'professional';
  const remaining = usageData
    ? Math.max(0, usageData.totalLimit - usageData.usedCount)
    : 0;
  const usedPct =
    usageData && usageData.totalLimit > 0
      ? Math.min(100, (usageData.usedCount / usageData.totalLimit) * 100)
      : 0;
  const isOut = usageData?.isLimitReached ?? false;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Plan &amp; AI credits
          <PlanBadge plan={PLAN_IDS[plan]} />
        </CardTitle>
        <CardDescription>
          {isUnlimited
            ? 'Your plan includes unlimited AI generations.'
            : plan === 'free'
              ? 'Free AI generations to try Infogiph.'
              : 'Monthly AI generations on your plan.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !usageData ? (
          <div className="h-12 animate-pulse rounded-md bg-muted" />
        ) : isUnlimited ? (
          <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Sparkles className="h-5 w-5 text-violet-500" />
            Unlimited
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-semibold text-foreground">
              {remaining}
              <span className="text-base font-normal text-muted-foreground">
                {' '}
                / {usageData.totalLimit} credits left
                {plan !== 'free' && ' this month'}
              </span>
            </div>
            <Progress value={usedPct} className="h-2" />
            {isOut && (
              <p className="text-sm text-red-600">
                You&apos;re out of credits —{' '}
                {plan === 'free'
                  ? 'upgrade to Pro for 500 a month.'
                  : 'upgrade to Max for unlimited generations.'}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {!isUnlimited && (
          <Button asChild size="sm">
            <LocaleLink href="/pricing">
              <Sparkles className="mr-1.5 h-4 w-4" />
              Upgrade
            </LocaleLink>
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <LocaleLink href="/dashboard/billing">Manage billing</LocaleLink>
        </Button>
      </CardFooter>
    </Card>
  );
}
