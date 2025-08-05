import { signIn, signOut, useSession } from 'next-auth/react';

/**
 * NextAuth client utilities
 */
export const authClient = {
  signIn: {
    social: async ({ provider }: { provider: string }) => {
      return await signIn(provider);
    },
    // Stub method - not applicable with Google OAuth only
    email: async () => {
      throw new Error('Email/password login not available with Google OAuth only');
    },
  },
  signUp: {
    // Stub method - not applicable with Google OAuth only
    email: async () => {
      throw new Error('Email/password registration not available with Google OAuth only');
    },
  },
  signOut: async () => {
    return await signOut();
  },
  useSession,
  // Stub methods to fix build errors - not applicable with Google OAuth only
  forgetPassword: async () => {
    throw new Error('Password reset not available with Google OAuth only');
  },
  resetPassword: async () => {
    throw new Error('Password reset not available with Google OAuth only');
  },
  // Additional stub methods
  changePassword: async () => {
    throw new Error('Password change not available with Google OAuth only');
  },
  updateUser: async () => {
    throw new Error('User update not available with Google OAuth only');
  },
  deleteUser: async () => {
    throw new Error('User deletion not available with Google OAuth only');
  },
};
