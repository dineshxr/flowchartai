// Shared, dependency-free constants. Safe to import from edge middleware
// (no Node or firebase-admin imports here).

/** Name of the HttpOnly cookie that holds the Firebase session. */
export const SESSION_COOKIE_NAME = 'fb_session';

/** Session cookie lifetime in milliseconds (14 days). */
export const SESSION_EXPIRES_IN_MS = 60 * 60 * 24 * 14 * 1000;
