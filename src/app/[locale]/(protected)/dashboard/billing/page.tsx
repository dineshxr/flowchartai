import { PLAN_BY_ID } from '@/config/plans';
import { canUserUseAI } from '@/lib/ai-usage';
import { getSession } from '@/lib/server';
import {
  getActiveSubscription,
  getInvoices,
  getUserPlan,
} from '@/lib/stripe/billing';
import { CheckCircle2, Download } from 'lucide-react';
import { redirect } from 'next/navigation';
import { ManageBillingButton, UpgradeButton } from './billing-actions';

export const dynamic = 'force-dynamic';

function money(amount: number, currency: string) {
  return (amount / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
}

function date(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function BillingPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard/billing');
  }
  const userId = session.user.id;

  // These reads hit Postgres (and, for invoices, Stripe). A transient
  // connection refusal here used to throw straight out of this force-dynamic
  // server component, which surfaces in production as the opaque
  // "An error occurred in the Server Components render … digest" error. Degrade
  // gracefully instead so a one-off DB/upstream hiccup never crashes the route.
  let plan: Awaited<ReturnType<typeof getUserPlan>>;
  let sub: Awaited<ReturnType<typeof getActiveSubscription>>;
  let usage: Awaited<ReturnType<typeof canUserUseAI>>;
  let invoices: Awaited<ReturnType<typeof getInvoices>>;
  try {
    [plan, sub, usage, invoices] = await Promise.all([
      getUserPlan(userId),
      getActiveSubscription(userId),
      canUserUseAI(userId),
      getInvoices(userId),
    ]);
  } catch (err) {
    console.error('[billing] failed to load billing data:', err);
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Billing &amp; plan
        </h1>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-semibold text-foreground">
            Billing is temporarily unavailable
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn&apos;t load your plan and invoices right now. This is
            usually a brief hiccup — please refresh in a moment.
          </p>
          <a
            href="/dashboard/billing"
            className="mt-4 inline-flex items-center rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-neutral-800"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  const meta = PLAN_BY_ID[plan];
  const isPaid = plan !== 'free';
  const limit = usage.limit ?? 0;
  const remaining = usage.remainingUsage ?? 0;
  const used = Math.max(0, limit - remaining);
  const unlimitedAI = meta.limits.aiGenerations === 'unlimited';
  const periodLabel =
    meta.limits.aiPeriod === 'lifetime' ? 'lifetime' : 'this month';

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Billing &amp; plan</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your subscription, see your credits, and download invoices.
      </p>

      {/* Plan card */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {meta.name} plan
              </span>
              {isPaid && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  {sub?.cancelAtPeriodEnd ? 'Cancelling' : 'Active'}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{meta.tagline}</p>
            {isPaid && sub?.periodEnd && (
              <p className="mt-2 text-xs text-muted-foreground">
                {sub.cancelAtPeriodEnd
                  ? `Access ends ${sub.periodEnd.toLocaleDateString()}.`
                  : `Renews ${sub.periodEnd.toLocaleDateString()}.`}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {isPaid ? (
              <>
                <ManageBillingButton />
                {plan === 'pro' && <UpgradeButton label="Go Max" />}
              </>
            ) : (
              <UpgradeButton label="Upgrade" />
            )}
          </div>
        </div>
      </div>

      {/* Usage / credits */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            AI generations
          </p>
          {unlimitedAI ? (
            <p className="mt-2 text-2xl font-bold text-foreground">Unlimited</p>
          ) : (
            <>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {remaining}
                <span className="text-base font-medium text-muted-foreground">
                  {' '}
                  / {limit} left
                </span>
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${limit ? (used / limit) * 100 : 0}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {used} used {periodLabel}
              </p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your plan includes
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
            <li>
              AI generations:{' '}
              {meta.limits.aiGenerations === 'unlimited'
                ? 'Unlimited'
                : `${meta.limits.aiGenerations} / ${
                    meta.limits.aiPeriod === 'month' ? 'month' : 'lifetime'
                  }`}
            </li>
            <li>
              Exports:{' '}
              {meta.limits.exports === 'unlimited'
                ? 'Unlimited'
                : meta.limits.exports}
            </li>
            <li>Watermark: {meta.limits.watermark ? 'Yes' : 'No'}</li>
            <li>Export formats: GIF, MP4 &amp; static image</li>
          </ul>
        </div>
      </div>

      {/* Billing history */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-6">
        <p className="text-sm font-semibold text-foreground">Billing history</p>
        {invoices.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No invoices yet. Invoices appear here after your first payment.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-border">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-3 py-2.5 text-sm"
              >
                <div className="min-w-0">
                  <span className="font-medium text-foreground">
                    {money(inv.amount, inv.currency)}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    {date(inv.created)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="capitalize text-muted-foreground">
                    {inv.status}
                  </span>
                  {inv.pdf && (
                    <a
                      href={inv.pdf}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-foreground hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
