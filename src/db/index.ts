/**
 * Firestore (Firebase) data layer.
 *
 * This replaces the previous Drizzle/PostgreSQL (Supabase) setup. The whole app
 * now runs on Google Firebase: Auth + Firestore (and Firebase Storage for
 * uploads). `getDb()` returns the Admin SDK Firestore instance.
 *
 * Query convention used across the codebase: filter by a SINGLE equality field
 * (e.g. userId / ipHash, which Firestore auto-indexes) and do any remaining
 * filtering / sorting / counting in memory. Per-user/per-collection document
 * counts here are small, so this avoids composite indexes entirely.
 */
import 'server-only';

import { getAdminApp } from '@/lib/firebase/admin';
import { type Firestore, getFirestore } from 'firebase-admin/firestore';

let cached: Firestore | null = null;

/**
 * The Admin Firestore instance. Synchronous, but kept callable as
 * `await getDb()` so existing call sites keep working unchanged.
 */
export function getDb(): Firestore {
  if (cached) return cached;
  cached = getFirestore(getAdminApp());
  return cached;
}
