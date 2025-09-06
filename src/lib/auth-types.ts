import type { Session as NextAuthSession, User as NextAuthUser } from 'next-auth';

// NextAuth.js types
export type Session = NextAuthSession;

export type User = NextAuthUser & {
  id: string;
};
