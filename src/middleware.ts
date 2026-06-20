import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { LOCALES, routing } from './i18n/routing';
import { SESSION_COOKIE_NAME } from './lib/firebase/constants';
import {
  DEFAULT_LOGIN_REDIRECT,
  protectedRoutes,
  routesNotAllowedByLoggedInUsers,
} from './routes';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Get the pathname without locale prefix (e.g. /zh/dashboard → /dashboard)
  const pathnameWithoutLocale = getPathnameWithoutLocale(
    nextUrl.pathname,
    LOCALES
  );

  // Skip authentication check for animate route to avoid slow loading
  const isAnimateRoute = pathnameWithoutLocale === '/animate';

  if (!isAnimateRoute) {
    // Edge-safe optimistic check: presence of the Firebase session cookie.
    // The cookie is cryptographically verified server-side in getSession();
    // forged cookies pass here but are rejected by every server read.
    const isLoggedIn = !!req.cookies.get(SESSION_COOKIE_NAME)?.value;

    // If the route can not be accessed by logged in users, redirect
    if (isLoggedIn) {
      const isNotAllowedRoute = routesNotAllowedByLoggedInUsers.some((route) =>
        new RegExp(`^${route}$`).test(pathnameWithoutLocale)
      );
      if (isNotAllowedRoute) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
    }

    const isProtectedRoute = protectedRoutes.some((route) =>
      new RegExp(`^${route}$`).test(pathnameWithoutLocale)
    );

    // If the route is protected and user is not logged in, redirect to login
    if (!isLoggedIn && isProtectedRoute) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      );
    }
  }

  return intlMiddleware(req);
}

/**
 * Get the pathname of the request (e.g. /zh/dashboard to /dashboard)
 */
function getPathnameWithoutLocale(pathname: string, locales: string[]): string {
  const localePattern = new RegExp(`^/(${locales.join('|')})/`);
  return pathname.replace(localePattern, '/');
}

/**
 * Next.js internationalized routing
 * specify the routes the middleware applies to
 */
export const config = {
  matcher: [
    // Match all pathnames except for
    // - if they start with `/api`, `/_next` or `/_vercel`
    // - if they contain a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
