'use client';

import { firebaseAuth, googleProvider } from '@/lib/firebase/client';
import {
  type User,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Types matching the shape consumers expect (unchanged across the app)
// ---------------------------------------------------------------------------
interface AppUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role?: string | null;
}

interface SessionData {
  user: AppUser;
}

function mapUser(user: User): AppUser {
  return {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || '',
    email: user.email || '',
    image: user.photoURL || null,
    role: null,
  };
}

// ---------------------------------------------------------------------------
// Keep the server-side HttpOnly session cookie in sync with the client token
// ---------------------------------------------------------------------------
async function syncSessionCookie(user: User | null) {
  try {
    if (user) {
      const idToken = await user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
    } else {
      await fetch('/api/auth/session', { method: 'DELETE' });
    }
  } catch {
    // Network hiccup syncing the cookie — non-fatal; will retry on next change.
  }
}

// ---------------------------------------------------------------------------
// useSession hook — drop-in replacement for the previous authClient.useSession()
// ---------------------------------------------------------------------------
function useSession(): { data: SessionData | null; isPending: boolean } {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    // Firebase not configured in this build → treat as signed-out, don't crash.
    if (!firebaseAuth) {
      setIsPending(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u ? mapUser(u) : null);
      setIsPending(false);
    });
    return () => unsubscribe();
  }, []);

  return { data: user ? { user } : null, isPending };
}

// ---------------------------------------------------------------------------
// signIn.social — Google-only via Firebase popup, then set the server cookie
// (the `provider` arg is kept for interface compatibility but always Google)
// ---------------------------------------------------------------------------
async function signInSocial({
  callbackURL,
}: {
  provider?: 'google' | 'github';
  callbackURL?: string;
}) {
  if (!firebaseAuth || !googleProvider) {
    return {
      error: {
        message:
          'Sign-in is not configured. Please contact support or try again later.',
      },
    };
  }
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    await syncSessionCookie(result.user);
    window.location.href = callbackURL || '/dashboard';
    return {};
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Sign-in failed. Please retry.';
    return { error: { message } };
  }
}

// ---------------------------------------------------------------------------
// signOut — drop-in replacement for the previous authClient.signOut()
// ---------------------------------------------------------------------------
async function signOut() {
  if (firebaseAuth) await firebaseSignOut(firebaseAuth);
  await syncSessionCookie(null);
  window.location.href = '/';
}

// ---------------------------------------------------------------------------
// $store.atoms.session — synchronous session access for utilities
// Also keeps the server cookie fresh as the ID token rotates.
// ---------------------------------------------------------------------------
let _cachedUser: AppUser | null = null;

if (typeof window !== 'undefined' && firebaseAuth) {
  onAuthStateChanged(firebaseAuth, (u) => {
    _cachedUser = u ? mapUser(u) : null;
    syncSessionCookie(u);
  });
}

const $store = {
  atoms: {
    session: {
      get(): SessionData | null {
        return _cachedUser ? { user: _cachedUser } : null;
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Exported client — same shape the rest of the app already imports
// ---------------------------------------------------------------------------
export const authClient = {
  useSession,
  signIn: {
    social: signInSocial,
  },
  signOut,
  $store,
};
