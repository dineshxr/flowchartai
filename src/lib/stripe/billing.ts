import 'server-only';

import type { PlanId } from '@/config/plans';
import { getDb } from '@/db';
import {
  COLLECTIONS,
  type PaymentDoc,
  type UserDoc,
  tsToDate,
} from '@/db/schema';
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
  const snap = await db.collection(COLLECTIONS.user).doc(userId).get();
  const customerId = snap.exists
    ? (snap.data() as UserDoc).customerId
    : undefined;
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
  const userRef = db.collection(COLLECTIONS.user).doc(userId);
  const snap = await userRef.get();
  const userData = snap.exists ? (snap.data() as UserDoc) : undefined;
  const existing = userData?.customerId;
  if (existing) return existing;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: email || userData?.email || undefined,
    metadata: { userId },
  });
  await userRef.set({ customerId: customer.id }, { merge: true });
  return customer.id;
}

/** Active (or grace-period) subscription row for a user, if any. */
export async function getActiveSubscription(userId: string) {
  const db = await getDb();
  const now = new Date();
  const qs = await db
    .collection(COLLECTIONS.payment)
    .where('userId', '==', userId)
    .get();
  const rows = qs.docs
    .map((d) => {
      const data = d.data() as PaymentDoc;
      return {
        ...data,
        periodEnd: tsToDate(data.periodEnd),
        createdAt: tsToDate(data.createdAt),
      };
    })
    .filter((p) => p.periodEnd && p.periodEnd >= now)
    .sort((a, b) => {
      const at = a.createdAt ? a.createdAt.getTime() : 0;
      const bt = b.createdAt ? b.createdAt.getTime() : 0;
      return bt - at;
    });
  return (
    rows.find(
      (p) =>
        p.status === 'active' ||
        p.status === 'trialing' ||
        // A failed renewal puts Stripe into ~2 weeks of smart retries, during
        // which the customer is still being billed and may well pay. Cutting
        // them to free the moment the first charge declines takes away the
        // plan they're paying for; the periodEnd filter above still bounds it.
        p.status === 'past_due' ||
        (p.status === 'canceled' &&
          p.cancelAtPeriodEnd &&
          p.periodEnd &&
          p.periodEnd > now)
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
 * Upsert a Stripe subscription into the `payment` collection. Called from the
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

  // `createdAt` is the sort key that decides which subscription is "current"
  // (getActiveSubscription, getUserSubscriptionStatus). Re-stamping it on every
  // sync makes whichever row was updated most recently sort first — so a late
  // webhook about an OLD subscription could outrank the live one and downgrade
  // the customer. Set it only when the row is first written.
  const ref = db.collection(COLLECTIONS.payment).doc(sub.id);
  const existing = await ref.get();
  await ref.set(
    existing.exists
      ? values
      : {
          ...values,
          createdAt: sub.created ? new Date(sub.created * 1000) : new Date(),
        },
    { merge: true }
  );
}

async function userIdForCustomer(customerId: string): Promise<string | null> {
  const db = await getDb();
  const qs = await db
    .collection(COLLECTIONS.user)
    .where('customerId', '==', customerId)
    .get();
  return qs.docs[0]?.id ?? null;
}
