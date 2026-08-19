import { getDb } from '@/db';
import { COLLECTIONS } from '@/db/schema';
import { verifyUnsubscribeToken } from '@/lib/lifecycle-emails';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * One-click unsubscribe from lifecycle/marketing email. Links are signed
 * (HMAC of the user id) so a link can only unsubscribe its own recipient.
 *
 * GET  → human clicked the footer link: unsubscribe + tiny confirmation page.
 * POST → RFC 8058 one-click (Gmail/Yahoo hit this from the List-Unsubscribe
 *        header without showing the user anything).
 */
async function unsubscribe(req: Request): Promise<boolean> {
  const url = new URL(req.url);
  const userId = url.searchParams.get('u') || '';
  const token = url.searchParams.get('t') || '';
  if (!userId || !verifyUnsubscribeToken(userId, token)) return false;

  const db = await getDb();
  await db
    .collection(COLLECTIONS.user)
    .doc(userId)
    .set({ emailPrefs: { marketing: false } }, { merge: true });
  return true;
}

export async function GET(req: Request) {
  const ok = await unsubscribe(req).catch(() => false);
  const body = ok
    ? `<main style="font-family:system-ui;max-width:28rem;margin:4rem auto;padding:0 1rem">
        <h1 style="font-size:1.25rem">You're unsubscribed</h1>
        <p>You won't get product or tips emails from Infogiph anymore.
        Account emails (receipts, password resets) still arrive.</p>
        <p style="color:#666;font-size:.875rem">Changed your mind? Email
        support@infogiph.com and we'll switch it back on.</p>
      </main>`
    : `<main style="font-family:system-ui;max-width:28rem;margin:4rem auto;padding:0 1rem">
        <h1 style="font-size:1.25rem">Link expired or invalid</h1>
        <p>This unsubscribe link didn't check out. Email
        support@infogiph.com and we'll take care of it.</p>
      </main>`;
  return new NextResponse(`<!doctype html><html><body>${body}</body></html>`, {
    status: ok ? 200 : 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function POST(req: Request) {
  const ok = await unsubscribe(req).catch(() => false);
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}
