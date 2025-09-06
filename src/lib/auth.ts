import { websiteConfig } from '@/config/website';
import { defaultMessages } from '@/i18n/messages';
import { LOCALE_COOKIE_NAME, routing } from '@/i18n/routing';
import { subscribe } from '@/newsletter';
import { parse as parseCookies } from 'cookie';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { Locale } from 'next-intl';
import { getBaseUrl } from './urls/urls';

/**
 * NextAuth.js configuration
 *
 * docs:
 * https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Auto subscribe user to newsletter after sign up if enabled in website config
      if (user.email && websiteConfig.newsletter.autoSubscribeAfterSignUp) {
        try {
          const subscribed = await subscribe(user.email);
          if (!subscribed) {
            console.error(
              `Failed to subscribe user ${user.email} to newsletter`
            );
          } else {
            console.log(`User ${user.email} subscribed to newsletter`);
          }
        } catch (error) {
          console.error('Newsletter subscription error:', error);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

/**
 * Gets the locale from a request by parsing the cookies
 * If no locale is found in the cookies, returns the default locale
 *
 * @param request - The request to get the locale from
 * @returns The locale from the request or the default locale
 */
export function getLocaleFromRequest(request?: Request): Locale {
  const cookies = parseCookies(request?.headers.get('cookie') ?? '');
  return (cookies[LOCALE_COOKIE_NAME] as Locale) ?? routing.defaultLocale;
}
