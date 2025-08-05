import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from './supabase';

/**
 * NextAuth configuration with Google provider and Supabase
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in Supabase
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError);
            return false;
          }

          // If user doesn't exist, create them
          if (!existingUser) {
            const { error: insertError } = await supabase.from('users').insert({
              email: user.email!,
              name: user.name,
              avatar_url: user.image,
            });

            if (insertError) {
              console.error('Error creating user:', insertError);
              return false;
            }
          }

          return true;
        } catch (error) {
          console.error('SignIn error:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        // Get user data from Supabase
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (user) {
          session.user.id = user.id;
          // Set default role for now (can be extended later)
          session.user.role = 'user';
        } else {
          // Fallback to email if user not found in DB
          session.user.id = session.user.email;
          session.user.role = 'user';
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};
