'use client';

import { LoginForm } from '@/components/auth/login-form';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, CreditCard, Sparkles } from 'lucide-react';

/**
 * Full-screen sign-in.
 *
 * Signing in is the single biggest drop-off in the funnel, and a small modal
 * makes it read like an interruption. This takes the whole viewport so the
 * reassurances land: no card, free to start, work preserved. Every gate in the
 * product (generate, export, chat) renders THIS — one sign-in experience, not
 * three slightly different dialogs.
 */
export function SignInTakeover({
  open,
  onOpenChange,
  title = 'Sign in to continue',
  subtitle = 'Create a free account in one click and pick up exactly where you left off.',
  callbackUrl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  callbackUrl?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Override the centred-card geometry DialogContent ships with so this
          fills the viewport. DialogContent renders its own close button. */}
      <DialogContent className="top-0 left-0 h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-[#fafafa] p-0 sm:max-w-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="flex h-full w-full items-center justify-center overflow-y-auto p-6">
          <div className="w-full max-w-[420px] py-8">
            <div className="text-center">
              <span className="ig-gradient mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_8px_30px_rgba(255,107,157,0.35)]">
                <Sparkles className="h-6 w-6" />
              </span>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="mx-auto mt-2 max-w-[340px] text-sm text-muted-foreground">
                {subtitle}
              </p>
            </div>

            {/* The reassurances, stated before the button rather than after */}
            <ul className="mx-auto mt-6 max-w-[340px] space-y-2.5">
              <li className="flex items-start gap-2.5 text-sm text-foreground/80">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  <strong className="font-semibold text-foreground">
                    No credit card, no payment required.
                  </strong>{' '}
                  Signing in is completely free.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-foreground/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Your work is saved — you&rsquo;ll land right back on this
                  diagram.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-foreground/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Free AI generations, unlimited exports and all 98 templates.
                </span>
              </li>
            </ul>

            <div className="mt-6">
              <LoginForm callbackUrl={callbackUrl} className="border-none" />
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              We&rsquo;ll never charge you without asking. Cancel anytime, on
              any plan.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
