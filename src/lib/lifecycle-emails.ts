import 'server-only';

import { getDb } from '@/db';
import { COLLECTIONS, type UserDoc, tsToDate } from '@/db/schema';
import { AI_USAGE_LIMITS } from '@/lib/ai-usage';
import { getBaseUrl } from '@/lib/urls/urls';
import { sendEmail } from '@/mail';

/**
 * Lifecycle emails — the return mechanisms for the signup→paid funnel.
 *
 *  - welcome      → on first user-doc creation (ensureUser)
 *  - creditsLow   → when a free user has exactly 1 generation left
 *                   (fired from recordAIUsage, the single record choke point)
 *  - capHit       → stamped when the last credit is burned; EMAIL goes out
 *                   ~24h later via the daily cron (/api/cron/lifecycle)
 *  - winBack      → 7+ days after signup, still free, inactive ≥7 days (cron)
 *
 * Every send is one-shot (deduped via user.lifecycle.*At) and must NEVER
 * break the calling path — all entry points swallow errors after logging.
 */

type LifecycleKind = 'welcome' | 'creditsLow' | 'capHit' | 'winBack';

const FLAG_FIELD: Record<LifecycleKind, string> = {
  welcome: 'welcomeAt',
  creditsLow: 'creditsLowAt',
  capHit: 'capHitEmailAt',
  winBack: 'winBackAt',
};

/** Real recipients only — skip the synthetic fallback addresses. */
function isRealEmail(email: string | undefined | null): email is string {
  return !!email && !email.endsWith('@users.infogiph.com');
}

async function markLifecycle(userId: string, field: string): Promise<void> {
  const db = await getDb();
  await db
    .collection(COLLECTIONS.user)
    .doc(userId)
    .set({ lifecycle: { [field]: new Date() } }, { merge: true });
}

/**
 * Send one lifecycle email if it hasn't been sent before. The flag is written
 * first (idempotency over completeness: a failed send is not retried, which
 * beats double-emailing users on races/retries).
 */
type LifecycleUser = Pick<UserDoc, 'id' | 'email' | 'name'> & {
  lifecycle?: UserDoc['lifecycle'];
};

async function sendOnce(
  kind: LifecycleKind,
  user: LifecycleUser,
  context: Record<string, unknown>
): Promise<boolean> {
  const flag = FLAG_FIELD[kind];
  if ((user.lifecycle as Record<string, unknown> | null | undefined)?.[flag]) {
    return false;
  }
  if (!isRealEmail(user.email)) return false;

  await markLifecycle(user.id, flag);
  const ok = await sendEmail({
    to: user.email,
    template: kind,
    context: { name: user.name || '', ...context },
  });
  if (!ok) console.error(`[lifecycle] ${kind} send failed for ${user.id}`);
  return ok;
}

/** Day-0 welcome — call after creating a brand-new user doc. */
export async function sendWelcomeEmail(user: LifecycleUser): Promise<void> {
  try {
    await sendOnce('welcome', user, { url: `${getBaseUrl()}/canvas` });
  } catch (err) {
    console.error('[lifecycle] welcome failed', err);
  }
}

/**
 * Called from recordAIUsage after every successful generation. For free users:
 * at 1 credit remaining send creditsLow; at 0 remaining stamp capHitAt so the
 * daily cron sends the +24h follow-up.
 *
 * `lifetimeSuccessCount` is the user's total successful generations INCLUDING
 * the one just recorded (the caller already has the usage query cached).
 */
export async function afterSuccessfulGeneration(
  userId: string,
  lifetimeSuccessCount: number,
  isFreeUser: boolean
): Promise<void> {
  try {
    if (!isFreeUser) return;
    const limit = AI_USAGE_LIMITS.FREE_USER_LIFETIME;
    if (lifetimeSuccessCount < limit - 1) return;

    const db = await getDb();
    const snap = await db.collection(COLLECTIONS.user).doc(userId).get();
    if (!snap.exists) return;
    const user = snap.data() as UserDoc;

    if (lifetimeSuccessCount === limit - 1) {
      await sendOnce('creditsLow', user, {
        url: `${getBaseUrl()}/pricing`,
      });
    } else if (
      lifetimeSuccessCount >= limit &&
      !tsToDate(user.lifecycle?.capHitAt)
    ) {
      await markLifecycle(userId, 'capHitAt');
    }
  } catch (err) {
    console.error('[lifecycle] afterSuccessfulGeneration failed', err);
  }
}

/** Is this user on a paid plan right now? (payment doc with a valid period) */
function hasActivePayment(
  payments: { userId?: string; status?: string; periodEnd?: unknown }[],
  userId: string,
  now: Date
): boolean {
  return payments.some((p) => {
    if (p.userId !== userId) return false;
    if (p.status !== 'active' && p.status !== 'trialing') return false;
    const end = tsToDate(p.periodEnd);
    return end != null && end >= now;
  });
}

/**
 * Daily cron sweep: cap-hit +24h follow-ups and day-7 win-backs.
 * Collection sizes are small (tens–hundreds of docs); full scans are fine and
 * avoid composite indexes, matching the codebase's query convention.
 */
export async function runLifecycleSweep(): Promise<{
  capHitSent: number;
  winBackSent: number;
}> {
  const db = await getDb();
  const now = new Date();
  const DAY = 24 * 60 * 60 * 1000;

  const [userSnap, paySnap, usageSnap] = await Promise.all([
    db.collection(COLLECTIONS.user).get(),
    db.collection(COLLECTIONS.payment).get(),
    db.collection(COLLECTIONS.aiUsage).get(),
  ]);
  const payments = paySnap.docs.map((d) => d.data());

  // Per-user successful-generation stats (count + most recent).
  const gen = new Map<string, { count: number; last: Date | null }>();
  for (const d of usageSnap.docs) {
    const u = d.data();
    if (u.success !== true || !u.userId) continue;
    const t = tsToDate(u.createdAt);
    const cur = gen.get(u.userId) || { count: 0, last: null };
    cur.count += 1;
    if (t && (!cur.last || t > cur.last)) cur.last = t;
    gen.set(u.userId, cur);
  }

  let capHitSent = 0;
  let winBackSent = 0;

  for (const doc of userSnap.docs) {
    const user = doc.data() as UserDoc;
    if (!isRealEmail(user.email)) continue;
    if (hasActivePayment(payments, user.id, now)) continue;

    const stats = gen.get(user.id) || { count: 0, last: null };

    // Cap-hit follow-up: last credit burned 24h+ ago, email not yet sent.
    const capHitAt = tsToDate(user.lifecycle?.capHitAt);
    if (capHitAt && now.getTime() - capHitAt.getTime() >= DAY) {
      const sent = await sendOnce('capHit', user, {
        url: `${getBaseUrl()}/pricing`,
      }).catch(() => false);
      if (sent) capHitSent += 1;
    }

    // Win-back: signed up 7+ days ago, no generation in the last 7 days,
    // and not already capped (capped users get the capHit email instead).
    const createdAt = tsToDate(user.createdAt);
    const lastActivity = stats.last ?? createdAt;
    if (
      createdAt &&
      now.getTime() - createdAt.getTime() >= 7 * DAY &&
      (!lastActivity || now.getTime() - lastActivity.getTime() >= 7 * DAY) &&
      !capHitAt
    ) {
      const creditsLeft = Math.max(
        0,
        AI_USAGE_LIMITS.FREE_USER_LIFETIME - stats.count
      );
      const sent = await sendOnce('winBack', user, {
        url: `${getBaseUrl()}/canvas`,
        creditsLeft,
      }).catch(() => false);
      if (sent) winBackSent += 1;
    }
  }

  return { capHitSent, winBackSent };
}
