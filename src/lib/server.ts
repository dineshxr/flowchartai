import 'server-only';

import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { cache } from 'react';
import { authOptions } from './auth';

/**
 * Get the current session
 *
 * NOTICE: do not call it from middleware
 */
export const getSession = cache(async () => {
  return await getServerSession(authOptions);
});
