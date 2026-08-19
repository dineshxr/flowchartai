'use client';

import { useAIUsageLimit } from '@/hooks/use-ai-usage-limit';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';
import { Sparkles, Zap } from 'lucide-react';

/**
 * Persistent AI-credits counter for generation UIs and the dashboard.
 *
 * States:
 *  - Max plan            → "Unlimited"
 *  - credits remaining   → "N / M left" (amber when running low)
 *  - credits exhausted   → red "0 left" + Upgrade CTA
 *
 * Free users always see an Upgrade affordance so running out is never the
 * first time they hear about paid plans. `onUpgrade` should open the
 * UpgradeDialog where one is mounted; it falls back to /pricing.
 */
export function CreditsCounter({
  className,
  onUpgrade,
}: {
  className?: string;
  onUpgrade?: () => void;
}) {
  const currentUser = useCurrentUser();
  const { usageData, isLoading } = useAIUsageLimit();

  // Guests have their own indicator; render nothing while signed out/loading.
  if (!currentUser || isLoading || !usageData) return null;

  const goUpgrade = () => {
    if (onUpgrade) onUpgrade();
    else window.location.href = '/pricing';
  };

  const isUnlimited = usageData.subscriptionStatus === 'professional';
  if (isUnlimited) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground',
          className
        )}
        title="Your plan includes unlimited AI generations"
      >
        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
        Unlimited credits
      </div>
    );
  }

  const remaining = Math.max(0, usageData.totalLimit - usageData.usedCount);
  const isOut = usageData.isLimitReached || remaining === 0;
  const isLow = !isOut && remaining <= Math.max(1, usageData.totalLimit * 0.2);
  const isFree = usageData.subscriptionStatus === 'free';
  const periodLabel = isFree ? 'free credits' : 'left this month';

  if (isOut) {
    return (
      <button
        type="button"
        onClick={goUpgrade}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100',
          className
        )}
        title={
          isFree
            ? 'You have used all your free credits — upgrade for 500 per month'
            : 'You have used this month’s credits — upgrade for unlimited'
        }
      >
        <Zap className="h-3.5 w-3.5" />0 credits left
        <span className="ml-0.5 rounded-full bg-red-600 px-2 py-px text-[11px] font-semibold text-white">
          Upgrade
        </span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        isLow
          ? 'border-amber-200 bg-amber-50 text-amber-800'
          : 'border-border bg-card text-foreground',
        className
      )}
      title={`${remaining} of ${usageData.totalLimit} AI generations remaining`}
    >
      <Sparkles
        className={cn(
          'h-3.5 w-3.5',
          isLow ? 'text-amber-500' : 'text-blue-500'
        )}
      />
      {remaining} / {usageData.totalLimit} {periodLabel}
      {isFree && (
        <button
          type="button"
          onClick={goUpgrade}
          className="ml-0.5 text-[11px] font-semibold text-blue-600 underline-offset-2 hover:underline"
        >
          Upgrade
        </button>
      )}
    </div>
  );
}
