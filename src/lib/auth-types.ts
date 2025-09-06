import type { Session as NextAuthSession, User as NextAuthUser } from 'next-auth';

// NextAuth.js types
export type Session = NextAuthSession;

export type User = NextAuthUser & {
  id: string;
  role?: string | null;
  emailVerified?: Date | null;
  banned?: boolean;
  banReason?: string | null;
  banExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};
