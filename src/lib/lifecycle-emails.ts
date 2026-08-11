import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { getDb } from '@/db';
import { COLLECTIONS, type UserDoc, tsToDate } from '@/db/schema';
import { AI_USAGE_LIMITS } from '@/lib/ai-usage';
import { digestContentForWeek } from '@/lib/digest-content';
import { allTemplates } from '@/lib/templates/catalog';
import { getBaseUrl } from '@/lib/urls/urls';
import { sendEmail } from '@/mail';

/**
 * Lifecycle emails — the return mechanisms for the signup→paid funnel.
 *
 * Onboarding (all users, one-shot, windowed by account age):
 *  - welcome          → on first user-doc creation (ensureUser)
 *  - firstWin         → day 1, only if the user hasn't generated anything
 *  - templatesTour    → day 3 (template library)
 *  - linkedinPlaybook → day 5 (export formats + the LinkedIn post recipe)
 *
 * Upgrade (free users only):
 *  - creditsLow   → when a free user has exactly 1 generation left
 *                   (fired from recordAIUsage, the single record choke point)
 *  - capHit       → stamped when the last credit is burned; EMAIL goes out
 *                   ~24h later via the daily cron (/api/cron/lifecycle)
 *  - upgradeNudge → ~4 days after cap-hit (watermark/credibility angle)
 *
 * Retention:
 *  - winBack      → 7+ days after signup, still free, inactive ≥7 days (cron)
 *  - weeklyDigest → Tuesdays, accounts ≥10 days old, active within 45 days
 *                   (or paid); content rotates from the template catalog and
 *                   is deduped per ISO week via lifecycle.digestWeekKey
 *
 * Every one-shot send is deduped via user.lifecycle.*At and must NEVER break
 * the calling path — all entry points swallow errors after logging. The cron
 * sends AT MOST ONE email per user per day. `emailPrefs.marketing === false`
 * (set by /api/email/unsubscribe) silences everything here.
 */

type LifecycleKind =
  | 'welcome'
  | 'creditsLow'
  | 'capHit'
  | 'winBack'
  | 'firstWin'
  | 'templatesTour'
  | 'linkedinPlaybook'
  | 'upgradeNudge';

const FLAG_FIELD: Record<LifecycleKind, string> = {
  welcome: 'welcomeAt',
  creditsLow: 'creditsLowAt',
  capHit: 'capHitEmailAt',
  winBack: 'winBackAt',
  firstWin: 'firstWinAt',
  templatesTour: 'templatesTourAt',
  linkedinPlaybook: 'linkedinPlaybookAt',
  upgradeNudge: 'upgradeNudgeAt',
};

/** Real recipients only — skip the synthetic fallback addresses. */
function isRealEmail(email: string | undefined | null): email is string {
  return !!email && !email.endsWith('@users.infogiph.com');
}

function hasOptedOut(user: Pick<UserDoc, 'emailPrefs'>): boolean {
  return user.emailPrefs?.marketing === false;
}

// ---- Unsubscribe links ------------------------------------------------------
// Signed with an HMAC so a link only ever unsubscribes its own recipient.
// /api/email/unsubscribe verifies the same signature.

function unsubscribeSecret(): string {
  return process.env.EMAIL_LINK_SECRET || process.env.CRON_SECRET || '';
}

export function unsubscribeToken(userId: string): string {
  return createHmac('sha256', unsubscribeSecret())
    .update(`unsub:${userId}`)
    .digest('hex')
    .slice(0, 32);
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  if (!unsubscribeSecret() || !token) return false;
  const expected = Buffer.from(unsubscribeToken(userId));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function unsubscribeUrlFor(userId: string): string {
  const u = encodeURIComponent(userId);
  return `${getBaseUrl()}/api/email/unsubscribe?u=${u}&t=${unsubscribeToken(userId)}`;
}

/** RFC 8058 one-click headers — Gmail/Yahoo require these for bulk senders. */
function unsubscribeHeaders(userId: string): Record<string, string> {
  return {
    'List-Unsubscribe': `<${unsubscribeUrlFor(userId)}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
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
  emailPrefs?: UserDoc['emailPrefs'];
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
  if (hasOptedOut(user)) return false;

  await markLifecycle(user.id, flag);
  const ok = await sendEmail({
    to: user.email,
    template: kind,
    context: {
      name: user.name || '',
      unsubscribeUrl: unsubscribeUrlFor(user.id),
      ...context,
    },
    headers: unsubscribeHeaders(user.id),
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

/** Send the weekly digest to one user, deduped per ISO week. */
async function sendDigest(
  user: LifecycleUser,
  weekKey: string,
  digest: ReturnType<typeof digestContentForWeek>
): Promise<boolean> {
  if (!isRealEmail(user.email) || hasOptedOut(user)) return false;
  if (user.lifecycle?.digestWeekKey === weekKey) return false;

  // Stamp before sending — same idempotency-over-completeness trade as
  // sendOnce: a failed send skips a week rather than double-emailing.
  const db = await getDb();
  await db
    .collection(COLLECTIONS.user)
    .doc(user.id)
    .set({ lifecycle: { digestWeekKey: weekKey } }, { merge: true });

  const ok = await sendEmail({
    to: user.email,
    template: 'weeklyDigest',
    subject: digest.subject,
    context: {
      name: user.name || '',
      formatName: digest.formatName,
      formatBlurb: digest.formatBlurb,
      formatUrl: digest.formatUrl,
      picks: digest.picks,
      recipe: digest.recipe,
      unsubscribeUrl: unsubscribeUrlFor(user.id),
    },
    headers: unsubscribeHeaders(user.id),
  });
  if (!ok) console.error(`[lifecycle] digest send failed for ${user.id}`);
  return ok;
}

/**
 * Daily cron sweep. One pass over all users; each user gets AT MOST ONE
 * email per sweep, picked in priority order: upgrade touches (highest
 * intent) → onboarding steps → win-back → weekly digest.
 *
 * Onboarding steps fire inside account-age windows, so accounts older than a
 * window when this ships simply skip it — no backlog blast.
 *
 * Collection sizes are small (tens–hundreds of docs); full scans are fine and
 * avoid composite indexes, matching the codebase's query convention.
 */
export async function runLifecycleSweep(): Promise<Record<string, number>> {
  const db = await getDb();
  const now = new Date();
  const DAY = 24 * 60 * 60 * 1000;
  const HOUR = 60 * 60 * 1000;

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

  // Digest ships on Tuesdays (cron runs 15:00 UTC daily).
  const isDigestDay = now.getUTCDay() === 2;
  const digest = digestContentForWeek(now);

  const sent: Record<string, number> = {
    capHit: 0,
    upgradeNudge: 0,
    firstWin: 0,
    templatesTour: 0,
    linkedinPlaybook: 0,
    winBack: 0,
    digest: 0,
  };

  for (const doc of userSnap.docs) {
    const user = doc.data() as UserDoc;
    if (!isRealEmail(user.email)) continue;
    if (hasOptedOut(user)) continue;

    const paid = hasActivePayment(payments, user.id, now);
    const stats = gen.get(user.id) || { count: 0, last: null };
    const createdAt = tsToDate(user.createdAt);
    const age = createdAt ? now.getTime() - createdAt.getTime() : null;
    const capHitAt = tsToDate(user.lifecycle?.capHitAt);

    const tally = async (kind: keyof typeof sent, p: Promise<boolean>) => {
      const ok = await p.catch(() => false);
      if (ok) sent[kind] += 1;
      return ok;
    };

    // 1. Cap-hit follow-up: last credit burned 24h+ ago (free users only).
    if (
      !paid &&
      capHitAt &&
      now.getTime() - capHitAt.getTime() >= DAY &&
      (await tally(
        'capHit',
        sendOnce('capHit', user, { url: `${getBaseUrl()}/pricing` })
      ))
    ) {
      continue;
    }

    // 2. Upgrade nudge: 4+ days after cap-hit, after the capHit email went out.
    if (
      !paid &&
      capHitAt &&
      user.lifecycle?.capHitEmailAt &&
      now.getTime() - capHitAt.getTime() >= 4 * DAY &&
      (await tally(
        'upgradeNudge',
        sendOnce('upgradeNudge', user, { url: `${getBaseUrl()}/pricing` })
      ))
    ) {
      continue;
    }

    // 3. Onboarding windows (all users, including paid — it's product
    //    education, not a pitch). Windows don't overlap, so at most one fires.
    if (age !== null) {
      if (
        age >= 20 * HOUR &&
        age < 3 * DAY &&
        stats.count === 0 &&
        (await tally(
          'firstWin',
          sendOnce('firstWin', user, { url: `${getBaseUrl()}/canvas` })
        ))
      ) {
        continue;
      }
      if (
        age >= 3 * DAY &&
        age < 5 * DAY &&
        (await tally(
          'templatesTour',
          sendOnce('templatesTour', user, {
            url: `${getBaseUrl()}/templates`,
            templateCount: allTemplates.length,
          })
        ))
      ) {
        continue;
      }
      if (
        age >= 5 * DAY &&
        age < 8 * DAY &&
        (await tally(
          'linkedinPlaybook',
          sendOnce('linkedinPlaybook', user, { url: `${getBaseUrl()}/canvas` })
        ))
      ) {
        continue;
      }
    }

    // 4. Win-back: signed up 7+ days ago, no generation in the last 7 days,
    //    and not already capped (capped users get the upgrade track instead).
    const lastActivity = stats.last ?? createdAt;
    if (
      !paid &&
      age !== null &&
      age >= 7 * DAY &&
      (!lastActivity || now.getTime() - lastActivity.getTime() >= 7 * DAY) &&
      !capHitAt
    ) {
      const creditsLeft = Math.max(
        0,
        AI_USAGE_LIMITS.FREE_USER_LIFETIME - stats.count
      );
      if (
        await tally(
          'winBack',
          sendOnce('winBack', user, {
            url: `${getBaseUrl()}/canvas`,
            creditsLeft,
          })
        )
      ) {
        continue;
      }
    }

    // 5. Weekly digest: Tuesdays, accounts ≥10 days old, active in the last
    //    45 days (paid accounts always count as active).
    if (isDigestDay && age !== null && age >= 10 * DAY) {
      const activeRecently =
        paid ||
        (lastActivity && now.getTime() - lastActivity.getTime() <= 45 * DAY);
      if (activeRecently) {
        await tally('digest', sendDigest(user, digest.weekKey, digest));
      }
    }
  }

  return sent;
}
