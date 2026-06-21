'use client';

import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { openBillingPortal } from '@/lib/stripe/checkout';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="outline"
      className="rounded-xl"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await openBillingPortal();
        setLoading(false);
      }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        'Manage subscription'
      )}
    </Button>
  );
}

export function UpgradeButton({ label = 'Upgrade' }: { label?: string }) {
  return (
    <Button
      asChild
      className="rounded-xl bg-foreground text-background hover:bg-neutral-800"
    >
      <LocaleLink href="/pricing">{label}</LocaleLink>
    </Button>
  );
}
