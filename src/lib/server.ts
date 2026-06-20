import 'server-only';

import { cookies } from 'next/headers';
import { cache } from 'react';
import { getAdminAuth } from './firebase/admin';
import { SESSION_COOKIE_NAME } from './firebase/constants';

/**
 * Get the current session by verifying the Firebase session cookie.
 *
 * Returns the same shape the rest of the app expects:
 *   { user: { id, name, email, image } } | null
 *
 * NOTICE: safe in Server Components, Route Handlers and Server Actions
 * (Node runtime). Do not call from edge middleware — check the cookie's
 * presence there instead (see src/middleware.ts).
 */
export const getSession = cache(async () => {
  try {
    const store = await cookies();
    const sessionCookie = store.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return null;

    const decoded = await getAdminAuth().verifySessionCookie(
      sessionCookie,
      false
    );

    return {
      user: {
        id: decoded.uid,
        name:
          (decoded.name as string | undefined) ||
          decoded.email?.split('@')[0] ||
          '',
        email: decoded.email || '',
        image: (decoded.picture as string | undefined) || null,
      },
    };
  } catch {
    // Invalid / expired / forged cookie → treat as signed out.
    return null;
  }
});
