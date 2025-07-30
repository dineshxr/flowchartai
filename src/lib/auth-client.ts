import { signIn, signOut, useSession } from 'next-auth/react';

/**
 * NextAuth client utilities
 */
export const authClient = {
  signIn: {
    social: async ({ provider }: { provider: string }) => {
      return await signIn(provider);
    },
  },
  signOut: async () => {
    return await signOut();
  },
  useSession,
};
