import { getAdminAuth } from '@/lib/firebase/admin';
import {
  SESSION_COOKIE_NAME,
  SESSION_EXPIRES_IN_MS,
} from '@/lib/firebase/constants';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// firebase-admin requires the Node.js runtime.
export const runtime = 'nodejs';

/**
 * POST: exchange a freshly-minted Firebase ID token for an HttpOnly session
 * cookie that server components / API routes / middleware can read.
 */
export async function POST(req: Request) {
  let idToken: string | undefined;
  try {
    ({ idToken } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  if (!idToken) {
    return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
  }

  try {
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN_MS,
    });
    const store = await cookies();
    store.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_EXPIRES_IN_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[auth/session] failed to create session cookie', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 401 }
    );
  }
}

/** DELETE: clear the session cookie (sign out). */
export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
