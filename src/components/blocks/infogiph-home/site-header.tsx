'use client';

import { LoginWrapper } from '@/components/auth/login-wrapper';
import { UserButton } from '@/components/layout/user-button';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label: 'Templates', href: '/templates' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
];

/**
 * The single header used across the whole site (home, landing pages, and the
 * marketing pages like /pricing and /blog). Replaces both the minimal home
 * TopBar and the legacy marketing Navbar so branding + login are consistent.
 * Login state comes from the authClient abstraction, so it works regardless of
 * the underlying auth provider.
 */
export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-border bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Brand + desktop nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label="Infogiph home"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/infogiph-logo.png"
              alt="Infogiph"
              className="h-7 w-auto"
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Auth + mobile toggle */}
        <div className="flex items-center gap-3">
          {!mounted || isPending ? (
            <Skeleton className="size-8 rounded-full border" />
          ) : user ? (
            <UserButton user={user} />
          ) : (
            <LoginWrapper mode="modal" asChild>
              <Button size="sm" className="rounded-full px-4">
                Log in
              </Button>
            </LoginWrapper>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-[#f5f5f5] hover:text-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-white px-4 py-3 md:hidden">
          {NAV_LINKS.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-[#f5f5f5] hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
