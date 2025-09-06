import { useSession, signIn, signOut } from 'next-auth/react';

/**
 * NextAuth.js client utilities
 * 
 * docs:
 * https://next-auth.js.org/getting-started/client
 */
export const authClient = {
  useSession,
  signIn,
  signOut,
};
