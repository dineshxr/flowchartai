import { getSession } from '@/lib/server';
import {
  type Interval,
  getOrCreateStripeCustomer,
  priceIdFor,
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
  try {
    const body = await req.json();
    plan = body.plan;
    interval = body.interval === 'year' ? 'year' : 'month';
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
    const customerId = await getOrCreateStripeCustomer(
      userId,
      session?.user?.email
    );
    const base = getBaseUrl();
    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/dashboard/billing?checkout=success`,
      cancel_url: `${base}/pricing?checkout=cancelled`,
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
