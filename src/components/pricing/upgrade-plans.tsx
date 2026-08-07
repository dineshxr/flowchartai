'use client';

import { Button } from '@/components/ui/button';
import { PLANS, type Plan } from '@/config/plans';
import { LocaleLink } from '@/i18n/navigation';
import { startCheckout } from '@/lib/stripe/checkout';
import { cn } from '@/lib/utils';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

function priceLabel(plan: Plan, yearly: boolean) {
  if (plan.priceMonthly === 0) return { big: 'Free', sub: 'forever' };
  const amount = yearly ? plan.priceYearlyMonthly : plan.priceMonthly;
  return {
    big: `$${amount}`,
    sub: yearly ? '/mo · billed yearly' : '/month',
  };
}

export function UpgradePlans() {
  // Monthly preselected: the one organic checkout failure was a yearly
  // upfront charge — keep the first purchase small; yearly stays a toggle.
  const [yearly, setYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const onUpgrade = async (plan: Plan) => {
    setLoadingPlan(plan.id);
    await startCheckout(plan.id as 'pro' | 'max', yearly ? 'year' : 'month');
    setLoadingPlan(null);
  };

  return (
    <section className="flex flex-col items-center">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Pricing
        </p>
        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          Ship clean, watermark-free infographics
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Start free. Upgrade for no watermark, 2K &amp; 4K video and GIF, and
          up to unlimited AI generations.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            !yearly
              ? 'bg-foreground text-background'
              : 'text-foreground/70 hover:text-foreground'
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            yearly
              ? 'bg-foreground text-background'
              : 'text-foreground/70 hover:text-foreground'
          )}
        >
          Yearly
          <span
            className={cn(
              'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
              yearly
                ? 'bg-background/20 text-background'
                : 'bg-emerald-100 text-emerald-700'
            )}
          >
            Save 25%
          </span>
        </button>
      </div>

      {/* Cards */}
      <div className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
        {PLANS.map((plan) => {
          const price = priceLabel(plan, yearly);
          const isPaid = plan.priceMonthly > 0;
          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-card p-6 transition-shadow',
                plan.highlight
                  ? 'border-foreground shadow-[0_20px_50px_-24px_rgba(15,42,62,0.45)]'
                  : 'border-border'
              )}
            >
              {plan.badge && (
                <span
                  className={cn(
                    'absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                    plan.highlight
                      ? 'bg-foreground text-background'
                      : 'bg-emerald-100 text-emerald-700'
                  )}
                >
                  {plan.highlight && <Sparkles className="h-3 w-3" />}
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 min-h-[40px] text-sm text-muted-foreground">
                {plan.tagline}
              </p>

              <div className="mt-4 flex items-end gap-1.5">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {price.big}
                </span>
                <span className="mb-1.5 text-sm text-muted-foreground">
                  {price.sub}
                </span>
              </div>

              {isPaid ? (
                <Button
                  onClick={() => onUpgrade(plan)}
                  disabled={loadingPlan === plan.id}
                  className={cn(
                    'mt-5 w-full rounded-xl',
                    plan.highlight
                      ? 'bg-foreground text-background hover:bg-neutral-800'
                      : 'bg-foreground/90 text-background hover:bg-foreground'
                  )}
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    plan.cta
                  )}
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="mt-5 w-full rounded-xl"
                >
                  <LocaleLink href="/canvas">{plan.cta}</LocaleLink>
                </Button>
              )}

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={cn(
                        'mt-0.5 h-4 w-4 shrink-0',
                        plan.highlight ? 'text-foreground' : 'text-emerald-600'
                      )}
                    />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        All plans include the full editor, 98 templates, and PNG · SVG · GIF ·
        MP4 export. Cancel anytime.
      </p>
    </section>
  );
}
