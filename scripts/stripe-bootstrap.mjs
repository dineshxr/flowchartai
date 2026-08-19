/**
 * One-shot Stripe billing bootstrap for Infogiph production.
 *
 * Reads STRIPE_SECRET_KEY from .env.local and then:
 *   1. verifies the four STRIPE_PRICE_* IDs exist and are active
 *   2. finds-or-recreates the production webhook endpoint
 *      (https://www.infogiph.com/api/webhooks/stripe) and prints its signing
 *      secret — an existing endpoint's secret can't be re-read, so a stale
 *      endpoint for the same URL is deleted and recreated
 *   3. ensures a Customer Portal configuration exists (required before
 *      /api/stripe/portal can create portal sessions)
 *
 * Usage: node scripts/stripe-bootstrap.mjs
 * Prints KEY=VALUE lines for anything that must be copied to Vercel.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Stripe from 'stripe';

const BASE_URL = 'https://www.infogiph.com';
const WEBHOOK_URL = `${BASE_URL}/api/webhooks/stripe`;
const WEBHOOK_EVENTS = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'checkout.session.completed',
];

// Minimal .env.local parser — avoids adding a dotenv dependency.
const env = {};
for (const line of readFileSync(resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=["']?([^"']*)["']?\s*$/);
  if (m) env[m[1]] = m[2];
}

const key = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error(
    'STRIPE_SECRET_KEY is empty in .env.local — create a key at\n' +
      'https://dashboard.stripe.com/apikeys and fill it in first.'
  );
  process.exit(1);
}
const stripe = new Stripe(key, { appInfo: { name: 'Infogiph bootstrap' } });

// ── 1. verify prices ─────────────────────────────────────────────────────────
const priceVars = [
  'STRIPE_PRICE_PRO_MONTHLY',
  'STRIPE_PRICE_PRO_YEARLY',
  'STRIPE_PRICE_MAX_MONTHLY',
  'STRIPE_PRICE_MAX_YEARLY',
];
for (const name of priceVars) {
  const id = env[name];
  if (!id) {
    console.error(`✗ ${name} is not set in .env.local`);
    process.exit(1);
  }
  const price = await stripe.prices.retrieve(id);
  if (!price.active) {
    console.error(`✗ ${name} → ${id} exists but is INACTIVE`);
    process.exit(1);
  }
  console.log(
    `✓ ${name} → ${id} ($${(price.unit_amount / 100).toFixed(0)}/${price.recurring.interval})`
  );
}

// ── 2. webhook endpoint ──────────────────────────────────────────────────────
const existing = await stripe.webhookEndpoints.list({ limit: 100 });
const stale = existing.data.filter((e) => e.url === WEBHOOK_URL);
for (const e of stale) {
  await stripe.webhookEndpoints.del(e.id);
  console.log(`✓ removed stale webhook endpoint ${e.id} (secret not readable)`);
}
const endpoint = await stripe.webhookEndpoints.create({
  url: WEBHOOK_URL,
  enabled_events: WEBHOOK_EVENTS,
  description: 'Infogiph production — syncs subscriptions to Firestore',
});
console.log(`✓ webhook endpoint created: ${endpoint.id} → ${WEBHOOK_URL}`);
console.log('\nSet this on Vercel production (and .env.local):');
console.log(`STRIPE_WEBHOOK_SECRET=${endpoint.secret}\n`);

// ── 3. customer portal configuration ────────────────────────────────────────
const configs = await stripe.billingPortal.configurations.list({ limit: 1 });
if (configs.data.length > 0) {
  console.log(`✓ customer portal already configured (${configs.data[0].id})`);
} else {
  const cfg = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: 'Infogiph — manage your subscription',
      privacy_policy_url: `${BASE_URL}/privacy`,
      terms_of_service_url: `${BASE_URL}/terms`,
    },
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      customer_update: {
        enabled: true,
        allowed_updates: ['email', 'address'],
      },
      subscription_cancel: {
        enabled: true,
        mode: 'at_period_end',
      },
    },
    default_return_url: `${BASE_URL}/dashboard/billing`,
  });
  console.log(`✓ customer portal configuration created (${cfg.id})`);
}

console.log('\nDone. Next: add STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET to');
console.log('Vercel production and redeploy.');
