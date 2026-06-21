import 'server-only';

import { getDb } from '@/db';
import { user } from '@/db/schema';

/**
 * Mirror a Firebase user into the `user` table. Everything that references
 * `user.id` (payments, credits, AI usage, saved flowcharts) needs this row to
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
  const email = u.email || `${u.id}@users.infogiph.com`;
  await db
    .insert(user)
    .values({
      id: u.id,
      email,
      name: u.name ?? null,
      image: u.image ?? null,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: user.id,
      set: {
        // Don't clobber a stored email with the fallback.
        ...(u.email ? { email: u.email } : {}),
        ...(u.name != null ? { name: u.name } : {}),
        ...(u.image != null ? { image: u.image } : {}),
        updatedAt: now,
      },
    });
}
