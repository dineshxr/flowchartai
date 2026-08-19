import { runLifecycleSweep } from '@/lib/lifecycle-emails';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daily lifecycle-email sweep (cap-hit +24h follow-ups, day-7 win-backs).
 * Invoked by Vercel Cron (see vercel.json). Vercel sends
 * `Authorization: Bearer ${CRON_SECRET}` automatically when the env var is
 * set; reject everything else so the route can't be triggered publicly.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET is not configured.' },
      { status: 503 }
    );
  }
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runLifecycleSweep();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[cron/lifecycle]', err);
    return NextResponse.json({ error: 'Sweep failed' }, { status: 500 });
  }
}
