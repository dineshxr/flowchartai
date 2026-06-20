'use client';

import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, GoogleAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Whether the public Firebase web config is present in this build. NEXT_PUBLIC_*
 * vars are inlined at build time, so a deploy missing them yields an empty
 * apiKey. We must NOT call initializeApp/getAuth in that case — Firebase throws
 * `auth/invalid-api-key`, and because this module is pulled in by the root
 * session provider, that throw would take down every page. Instead we degrade
 * gracefully: the app renders signed-out and only the sign-in action reports the
 * misconfiguration.
 */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let provider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    // Google is the only sign-in method. Force account selection each time.
    provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.error('[firebase] initialization failed:', error);
    app = null;
    auth = null;
    provider = null;
  }
} else if (typeof window !== 'undefined') {
  console.warn(
    '[firebase] NEXT_PUBLIC_FIREBASE_* env vars are missing from this build — ' +
      'sign-in is disabled. Set them in your deployment and rebuild.'
  );
}

export const firebaseApp = app;
export const firebaseAuth = auth;
export const googleProvider = provider;
