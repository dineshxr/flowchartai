import 'server-only';

import { headers } from 'next/headers';
import { cache } from 'react';
import { auth } from './auth';

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
