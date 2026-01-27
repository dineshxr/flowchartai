import type {
  Session as NextAuthSession,
  User as NextAuthUser,
} from 'next-auth';

// Extend NextAuth types with our custom fields
export type Session = NextAuthSession & {
  user: User;
};

export type User = NextAuthUser & {
  id: string;
  role?: string | null;
  emailVerified?: boolean | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  customerId?: string | null;
};
