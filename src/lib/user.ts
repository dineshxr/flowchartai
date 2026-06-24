import 'server-only';

import { getDb } from '@/db';
import { COLLECTIONS, type UserDoc } from '@/db/schema';

/**
 * Mirror a Firebase user into the `user` collection. Everything that references
 * `user.id` (payments, credits, AI usage, saved flowcharts) needs this doc to
 * exist — Firebase auth alone never creates it. Called on session creation.
 */
export async function ensureUser(u: {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}): Promise<void> {
  const db = await getDb();
  const now = new Date();
  const ref = db.collection(COLLECTIONS.user).doc(u.id);
  const snap = await ref.get();

  if (!snap.exists) {
    // First create: write the full doc, set createdAt + updatedAt.
    const email = u.email || `${u.id}@users.infogiph.com`;
    const doc: UserDoc = {
      id: u.id,
      email,
      name: u.name ?? null,
      image: u.image ?? null,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    };
    await ref.set(doc);
    return;
  }

  // Existing doc: update only provided fields (never clobber a stored email
  // with the fallback) + always bump updatedAt. No undefined values.
  const update: Partial<UserDoc> = { updatedAt: now };
  if (u.email) {
    update.email = u.email;
  }
  if (u.name != null) {
    update.name = u.name;
  }
  if (u.image != null) {
    update.image = u.image;
  }
  await ref.update(update);
}
