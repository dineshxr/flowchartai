import { syncSubscription } from '@/lib/stripe/billing';
import { getStripe } from '@/lib/stripe/client';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

/**
 * Stripe webhook. Keeps the `payment` table in sync with Stripe so plan
 * detection (credits, watermark, resolution) always reflects reality.
 *
 * Configure the endpoint at https://dashboard.stripe.com/webhooks pointing at
 * <site>/api/webhooks/stripe and set STRIPE_WEBHOOK_SECRET. Subscribe to
 * customer.subscription.* and checkout.session.completed.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');
  if (!secret || !sig) {
    return NextResponse.json(
      { error: 'Webhook is not configured.' },
      { status: 400 }
    );
  }

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, sig, secret);
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      case 'checkout.session.completed': {
        const cs = event.data.object as Stripe.Checkout.Session;
        if (cs.subscription) {
          const sub = await getStripe().subscriptions.retrieve(
            cs.subscription as string
          );
          await syncSubscription(sub);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('[stripe/webhook] handler error', event.type, err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
