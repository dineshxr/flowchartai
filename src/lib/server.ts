import 'server-only';

import { headers } from 'next/headers';
import { cache } from 'react';
import { authOptions } from './auth';
import { getServerSession } from 'next-auth';

/**
 * Get the current session
 *
 * NOTICE: do not call it from middleware
 */
export const getSession = cache(async () => {
  return await getServerSession(authOptions);
});
