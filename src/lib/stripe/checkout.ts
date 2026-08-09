import { toast } from 'sonner';

/**
 * Client helper: start a Stripe Checkout for a paid plan, redirecting to the
 * hosted checkout page. Sends signed-out users to login, and degrades to a
 * friendly message if billing isn't configured yet.
 */
export async function startCheckout(
  plan: 'pro' | 'max',
  interval: 'month' | 'year',
  opts: {
    /** Path to land back on after checkout (e.g. the canvas being edited). */
    returnTo?: string;
  } = {}
): Promise<void> {
  try {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, interval, returnTo: opts.returnTo }),
    });

    if (res.status === 401) {
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(opts.returnTo || '/pricing')}`;
      return;
    }

    const data = await res.json().catch(
      () =>
        ({}) as {
          url?: string;
          error?: string;
          message?: string;
          changed?: boolean;
        }
    );
    if (res.ok && data.url) {
      // `changed` means we swapped the plan on the existing subscription
      // instead of opening a new one — there's no Stripe page to visit.
      if (data.changed) toast.success('Your plan has been updated.');
      window.location.href = data.url;
      return;
    }
    if (res.status === 409) {
      // Already subscribed to this exact plan — send them to billing rather
      // than letting them buy it a second time.
      toast.info(data.message || "You're already on this plan.");
      if (data.url) window.location.href = data.url;
      return;
    }
    if (res.status === 503) {
      toast.error('Billing is being set up — please check back soon.');
      return;
    }
    toast.error(data.error || 'Could not start checkout.');
  } catch {
    toast.error('Could not start checkout.');
  }
}

/** Client helper: open the Stripe billing portal (manage / cancel / invoices). */
export async function openBillingPortal(): Promise<void> {
  try {
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    if (res.status === 401) {
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent('/dashboard/billing')}`;
      return;
    }
    const data = await res
      .json()
      .catch(() => ({}) as { url?: string; error?: string });
    if (res.ok && data.url) {
      window.location.href = data.url;
      return;
    }
    toast.error(data.error || 'Could not open billing.');
  } catch {
    toast.error('Could not open billing.');
  }
}
