import { getSession } from '@/lib/server';
import {
  type Interval,
  getActiveSubscription,
  getOrCreateStripeCustomer,
  priceIdFor,
  syncSubscription,
} from '@/lib/stripe/billing';
import { getStripe, isStripeConfigured } from '@/lib/stripe/client';
import { getBaseUrl } from '@/lib/urls/urls';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** POST { plan, interval } → a Stripe Checkout Session URL for that plan. */
export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Billing is not configured yet.' },
      { status: 503 }
    );
  }

  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  }

  let plan: string | undefined;
  let interval: Interval = 'month';
  let returnTo: string | null = null;
  try {
    const body = await req.json();
    plan = body.plan;
    interval = body.interval === 'year' ? 'year' : 'month';
    // Optional path to send the user back to after checkout (e.g. the canvas
    // they were working on). Same-origin relative paths only.
    if (
      typeof body.returnTo === 'string' &&
      body.returnTo.startsWith('/') &&
      !body.returnTo.startsWith('//') &&
      body.returnTo.length <= 300
    ) {
      returnTo = body.returnTo;
    }
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const priceId = plan ? priceIdFor(plan as any, interval) : undefined;
  if (!priceId) {
    return NextResponse.json(
      { error: 'That plan is not available.' },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    const base = getBaseUrl();

    // A user with a live subscription must never be sent through Checkout
    // again — that opens a SECOND subscription and bills them twice for one
    // plan's worth of access. Same plan is a no-op; a different plan is a
    // proration-aware swap on the existing subscription.
    const existing = await getActiveSubscription(userId);
    if (existing?.subscriptionId) {
      if (existing.priceId === priceId) {
        return NextResponse.json(
          {
            error: 'already-subscribed',
            message: "You're already on this plan.",
            url: `${base}/dashboard/billing`,
          },
          { status: 409 }
        );
      }

      const sub = await stripe.subscriptions.retrieve(existing.subscriptionId);
      const itemId = sub.items.data[0]?.id;
      if (!itemId) {
        return NextResponse.json(
          { error: 'Could not update your subscription.' },
          { status: 500 }
        );
      }
      const updated = await stripe.subscriptions.update(
        existing.subscriptionId,
        {
          items: [{ id: itemId, price: priceId }],
          proration_behavior: 'always_invoice',
          cancel_at_period_end: false,
          metadata: { userId, plan: plan as string },
        }
      );
      // Reflect the new plan immediately rather than waiting on the webhook.
      await syncSubscription(updated);
      return NextResponse.json({
        changed: true,
        url: returnTo
          ? `${base}${returnTo}${returnTo.includes('?') ? '&' : '?'}checkout=success`
          : `${base}/dashboard/billing?checkout=success`,
      });
    }

    const customerId = await getOrCreateStripeCustomer(
      userId,
      session?.user?.email
    );
    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: returnTo
        ? `${base}${returnTo}${returnTo.includes('?') ? '&' : '?'}checkout=success`
        : `${base}/dashboard/billing?checkout=success`,
      cancel_url: returnTo
        ? `${base}${returnTo}${returnTo.includes('?') ? '&' : '?'}checkout=cancelled`
        : `${base}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      client_reference_id: userId,
      subscription_data: { metadata: { userId, plan: plan as string } },
      metadata: { userId, plan: plan as string },
    });
    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error('[stripe/checkout]', error);
    return NextResponse.json({ error: 'Checkout failed.' }, { status: 500 });
  }
}
