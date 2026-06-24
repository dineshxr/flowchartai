import 'server-only';

import {
  type App,
  cert,
  getApp,
  getApps,
  initializeApp,
} from 'firebase-admin/app';
import { type Auth, getAuth } from 'firebase-admin/auth';

/**
 * Parse the service account from FIREBASE_SERVICE_ACCOUNT_KEY.
 * Accepts either raw JSON or a base64-encoded JSON string.
 */
function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY is not set. Generate a service account key in the Firebase console (Project settings → Service accounts) and add it (base64-encoded) to your environment.'
    );
  }
  const json = raw.trim().startsWith('{')
    ? raw
    : Buffer.from(raw, 'base64').toString('utf8');
  return JSON.parse(json) as {
    project_id: string;
    client_email: string;
    private_key: string;
  };
}

let cachedApp: App | null = null;
let cachedProjectId: string | null = null;

export function getAdminApp(): App {
  if (getApps().length) {
    return getApp();
  }
  if (!cachedApp) {
    const sa = getServiceAccount();
    cachedProjectId = sa.project_id;
    cachedApp = initializeApp({
      credential: cert({
        projectId: sa.project_id,
        clientEmail: sa.client_email,
        privateKey: sa.private_key,
      }),
      storageBucket: getStorageBucket(sa.project_id),
    });
  }
  return cachedApp;
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

/** The Firebase project id backing the Admin SDK. */
export function getAdminProjectId(): string {
  if (cachedProjectId) return cachedProjectId;
  cachedProjectId = getServiceAccount().project_id;
  return cachedProjectId;
}

/**
 * Default Cloud Storage bucket. Override with FIREBASE_STORAGE_BUCKET; otherwise
 * fall back to the project's default bucket.
 */
export function getStorageBucket(projectId?: string): string {
  return (
    process.env.FIREBASE_STORAGE_BUCKET ||
    `${projectId || getAdminProjectId()}.appspot.com`
  );
}
