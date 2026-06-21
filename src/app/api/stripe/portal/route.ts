import { getSession } from '@/lib/server';
import { getOrCreateStripeCustomer } from '@/lib/stripe/billing';
import { getStripe, isStripeConfigured } from '@/lib/stripe/client';
import { getBaseUrl } from '@/lib/urls/urls';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** POST → a Stripe Billing Portal URL (manage / upgrade / cancel / invoices). */
export async function POST() {
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

  try {
    const stripe = getStripe();
    const customerId = await getOrCreateStripeCustomer(
      userId,
      session?.user?.email
    );
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getBaseUrl()}/dashboard/billing`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error('[stripe/portal]', error);
    return NextResponse.json(
      { error: 'Could not open the billing portal.' },
      { status: 500 }
    );
  }
}
