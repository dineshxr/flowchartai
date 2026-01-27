import 'server-only';

import { auth } from './auth';
import { headers } from 'next/headers';
import { cache } from 'react';

/**
 * Get the current session using better-auth
 *
 * NOTICE: do not call it from middleware
 */
export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});
