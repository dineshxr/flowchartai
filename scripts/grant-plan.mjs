/**
 * Grant (or revoke) a complimentary plan for a user — for testing and comps.
 *
 * Writes a synthetic doc to the `payment` collection with a far-future
 * periodEnd, so every plan-derived surface (AI limits, watermark, resolution,
 * billing page, badges) sees the user as subscribed. A later REAL Stripe
 * subscription takes precedence automatically (newer createdAt wins), and if
 * it lapses the comp resurfaces.
 *
 * Usage:
 *   node scripts/grant-plan.mjs <email> <pro|max>   # grant forever
 *   node scripts/grant-plan.mjs <email> free        # revoke the comp
 *
 * Reads FIREBASE_SERVICE_ACCOUNT_KEY and STRIPE_PRICE_* from .env.local.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const [email, plan] = process.argv.slice(2);
if (!email || !['pro', 'max', 'free'].includes(plan)) {
  console.error('Usage: node scripts/grant-plan.mjs <email> <pro|max|free>');
  process.exit(1);
}

// Minimal .env.local parser — avoids adding a dotenv dependency.
const env = {};
for (const line of readFileSync(resolve('.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=["']?([^"']*)["']?\s*$/);
  if (m) env[m[1]] = m[2];
}

let saRaw = env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!saRaw) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY missing from .env.local');
  process.exit(1);
}
if (!saRaw.startsWith('{')) {
  saRaw = Buffer.from(saRaw, 'base64').toString('utf8');
}
initializeApp({ credential: cert(JSON.parse(saRaw)) });
const db = getFirestore();

// ── find the user ────────────────────────────────────────────────────────────
const users = await db.collection('user').where('email', '==', email).get();
if (users.empty) {
  console.error(
    `✗ No user with email ${email} — they must sign in once first.`
  );
  process.exit(1);
}
const userId = users.docs[0].id;
console.log(`✓ found user ${userId} (${email})`);

const compRef = db.collection('payment').doc(`comp_${userId}`);

// ── revoke ───────────────────────────────────────────────────────────────────
if (plan === 'free') {
  await compRef.delete();
  console.log(`✓ comp plan removed — ${email} is back on their real plan.`);
  process.exit(0);
}

// ── grant ────────────────────────────────────────────────────────────────────
const priceEnv =
  plan === 'max' ? 'STRIPE_PRICE_MAX_MONTHLY' : 'STRIPE_PRICE_PRO_MONTHLY';
const priceId = env[priceEnv];
if (!priceId) {
  console.error(`✗ ${priceEnv} missing from .env.local`);
  process.exit(1);
}

const now = new Date();
const doc = {
  id: `comp_${userId}`,
  priceId, // real price ID so planForPriceId() resolves the tier
  type: 'subscription',
  interval: 'month',
  userId,
  customerId: 'comp_internal',
  subscriptionId: `comp_${userId}`,
  status: 'active',
  periodStart: now,
  periodEnd: new Date('2126-01-01T00:00:00Z'), // "forever"
  cancelAtPeriodEnd: false,
  canceledAt: null,
  createdAt: now,
  updatedAt: now,
  metadata: { comp: true, grantedVia: 'scripts/grant-plan.mjs' },
};
await compRef.set(doc);
console.log(
  `✓ ${email} is now on ${plan.toUpperCase()} until 2126 (doc payment/comp_${userId}, price ${priceId}).`
);
process.exit(0);
