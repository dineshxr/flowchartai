'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

/**
 * Error boundary for the authenticated area (dashboard, settings, admin).
 *
 * A throw in any of these server components — e.g. a transient Postgres
 * `connect ECONNREFUSED` from a billing/usage query — would otherwise bubble to
 * the locale-root boundary and show up in production as the opaque
 * "An error occurred in the Server Components render … digest" message. Catching
 * it here keeps the user inside the app with a working retry.
 */
export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[protected] route error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center">
        <h2 className="text-lg font-bold text-foreground">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We hit a temporary problem loading this page. This is usually brief —
          please try again.
        </p>
        <Button onClick={() => reset()} className="mt-5 rounded-xl">
          Try again
        </Button>
      </div>
    </div>
  );
}
