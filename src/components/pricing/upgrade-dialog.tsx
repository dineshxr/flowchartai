'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PLAN_BY_ID, UPGRADE_VALUE_PROPS } from '@/config/plans';
import { LocaleLink } from '@/i18n/navigation';
import { startCheckout } from '@/lib/stripe/checkout';
import { cn } from '@/lib/utils';
import {
  BadgeCheck,
  Film,
  Gauge,
  ImageOff,
  Loader2,
  Palette,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const ICONS = {
  sparkles: Sparkles,
  'image-off': ImageOff,
  gauge: Gauge,
  film: Film,
  palette: Palette,
  badge: BadgeCheck,
} as const;

/**
 * Reusable upgrade prompt. Opened from the canvas (locked resolution / remove
 * watermark / out of credits) and the dashboard.
 *
 * Checkout starts directly from the dialog (monthly preselected) — the cap
 * moment converts in one click instead of routing through /pricing.
 */
export function UpgradeDialog({
  open,
  onOpenChange,
  reason,
  returnTo,
  onBeforeCheckout,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Short context, e.g. "Export without the watermark with Pro." */
  reason?: string;
  /** Path to come back to after checkout (e.g. the canvas being edited). */
  returnTo?: string;
  /**
   * Runs before redirecting to Stripe — e.g. save the current diagram. May
   * resolve to a path that overrides `returnTo` (a freshly saved /canvas/[id]).
   */
  onBeforeCheckout?: () => void | string | Promise<string | undefined>;
}) {
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const pro = PLAN_BY_ID.pro;
  const price = yearly ? pro.priceYearlyMonthly : pro.priceMonthly;

  const onUpgrade = async () => {
    setLoading(true);
    try {
      let dest = returnTo;
      if (onBeforeCheckout) {
        // Save first so "pick up where you left off" is true — but never let a
        // slow save block the purchase.
        const saved = await Promise.race([
          Promise.resolve(onBeforeCheckout()).catch(() => undefined),
          new Promise<undefined>((resolve) => setTimeout(resolve, 4000)),
        ]);
        if (typeof saved === 'string' && saved.startsWith('/')) dest = saved;
      }
      await startCheckout('pro', yearly ? 'year' : 'month', {
        returnTo: dest,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5" />
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>

        {reason ? (
          <p className="-mt-1 text-sm text-muted-foreground">{reason}</p>
        ) : null}

        <div className="mt-1 space-y-3">
          {UPGRADE_VALUE_PROPS.map((v) => {
            const Icon = ICONS[v.icon] ?? Sparkles;
            return (
              <div key={v.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {v.title}
                  </div>
                  <div className="text-xs text-muted-foreground">{v.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Billing interval — monthly preselected */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-muted/40 px-3 py-2">
          <div>
            <div className="text-sm font-semibold text-foreground">
              Pro — ${price}/mo
            </div>
            <div className="text-xs text-muted-foreground">
              {yearly ? 'Billed yearly · save 25%' : 'Billed monthly'} · cancel
              anytime
            </div>
          </div>
          <div className="inline-flex items-center rounded-full border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                !yearly
                  ? 'bg-foreground text-background'
                  : 'text-foreground/60 hover:text-foreground'
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                yearly
                  ? 'bg-foreground text-background'
                  : 'text-foreground/60 hover:text-foreground'
              )}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            onClick={onUpgrade}
            disabled={loading}
            className="flex-1 rounded-xl bg-foreground text-background hover:bg-neutral-800"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Upgrade to Pro — ${price}/mo</>
            )}
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Not now
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Your work is saved — checkout brings you right back here.{' '}
          <LocaleLink
            href="/pricing"
            className="underline hover:text-foreground"
          >
            Compare all plans
          </LocaleLink>
        </p>
      </DialogContent>
    </Dialog>
  );
}
