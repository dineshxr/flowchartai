import 'server-only';

import Stripe from 'stripe';

let cached: Stripe | null = null;

/** Lazily-constructed server Stripe client. Throws if the key is missing. */
export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set — add it to your environment to enable billing.'
    );
  }
  cached = new Stripe(key, { appInfo: { name: 'Infogiph' } });
  return cached;
}

/** Whether billing is wired up in this environment. */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
