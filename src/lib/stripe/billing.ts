import 'server-only';

import type { PlanId } from '@/config/plans';
import { getDb } from '@/db';
import { payment, user } from '@/db/schema';
import { and, desc, eq, gte } from 'drizzle-orm';
import type Stripe from 'stripe';
import { getStripe, isStripeConfigured } from './client';
import { type Interval, planForPriceId, priceIdFor } from './prices';

export interface InvoiceSummary {
  id: string;
  number: string | null;
  amount: number;
  currency: string;
  status: string | null;
  created: number;
  pdf: string | null;
  hostedUrl: string | null;
}

/** Recent invoices for a user's Stripe customer (for the billing history). */
export async function getInvoices(
  userId: string,
  limit = 8
): Promise<InvoiceSummary[]> {
  if (!isStripeConfigured()) return [];
  const db = await getDb();
  const rows = await db
    .select({ customerId: user.customerId })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  const customerId = rows[0]?.customerId;
  if (!customerId) return [];
  try {
    const list = await getStripe().invoices.list({
      customer: customerId,
      limit,
    });
    return list.data.map((inv) => ({
      id: inv.id ?? '',
      number: inv.number ?? null,
      amount: inv.amount_paid,
      currency: inv.currency,
      status: inv.status ?? null,
      created: inv.created,
      pdf: inv.invoice_pdf ?? null,
      hostedUrl: inv.hosted_invoice_url ?? null,
    }));
  } catch {
    return [];
  }
}

export { priceIdFor, planForPriceId };
export type { Interval };

/**
 * Ensure the user has a Stripe customer, returning its ID. Stores the ID on
 * `user.customerId` so we don't create duplicate customers.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email?: string | null
): Promise<string> {
  const db = await getDb();
  const rows = await db
    .select({ customerId: user.customerId, email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  const existing = rows[0]?.customerId;
  if (existing) return existing;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: email || rows[0]?.email || undefined,
    metadata: { userId },
  });
  await db
    .update(user)
    .set({ customerId: customer.id })
    .where(eq(user.id, userId));
  return customer.id;
}

/** Active (or grace-period) subscription row for a user, if any. */
export async function getActiveSubscription(userId: string) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(payment)
    .where(and(eq(payment.userId, userId), gte(payment.periodEnd, new Date())))
    .orderBy(desc(payment.createdAt));
  return (
    rows.find(
      (p) =>
        p.status === 'active' ||
        p.status === 'trialing' ||
        (p.status === 'canceled' &&
          p.cancelAtPeriodEnd &&
          p.periodEnd &&
          p.periodEnd > new Date())
    ) ?? null
  );
}

/** The user's current plan, derived from their subscription. */
export async function getUserPlan(userId: string): Promise<PlanId> {
  const sub = await getActiveSubscription(userId);
  if (!sub) return 'free';
  return planForPriceId(sub.priceId)?.plan ?? 'free';
}

/**
 * Upsert a Stripe subscription into the `payment` table. Called from the
 * webhook so plan detection always reflects Stripe.
 */
export async function syncSubscription(
  sub: Stripe.Subscription
): Promise<void> {
  const db = await getDb();
  const userId =
    (sub.metadata?.userId as string | undefined) ||
    (await userIdForCustomer(sub.customer as string));
  if (!userId) return;

  const item = sub.items.data[0];
  const priceId = item?.price?.id ?? '';
  const interval = item?.price?.recurring?.interval ?? null;
  // `current_period_*` live on the item in newer API versions, on the
  // subscription in older ones — read both so we work regardless of the pin.
  const periodStart =
    (item as any)?.current_period_start ??
    (sub as any).current_period_start ??
    sub.start_date;
  const periodEnd =
    (item as any)?.current_period_end ??
    (sub as any).current_period_end ??
    null;

  const values = {
    id: sub.id,
    priceId,
    type: 'subscription',
    interval,
    userId,
    customerId: sub.customer as string,
    subscriptionId: sub.id,
    status: sub.status,
    periodStart: periodStart ? new Date(periodStart * 1000) : null,
    periodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
    canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    updatedAt: new Date(),
  };

  await db
    .insert(payment)
    .values({ ...values, createdAt: new Date() })
    .onConflictDoUpdate({ target: payment.id, set: values });
}

async function userIdForCustomer(customerId: string): Promise<string | null> {
  const db = await getDb();
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.customerId, customerId))
    .limit(1);
  return rows[0]?.id ?? null;
}
