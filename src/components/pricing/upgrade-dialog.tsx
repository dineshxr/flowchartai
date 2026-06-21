'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UPGRADE_VALUE_PROPS } from '@/config/plans';
import { LocaleLink } from '@/i18n/navigation';
import {
  BadgeCheck,
  Film,
  Gauge,
  ImageOff,
  Palette,
  Sparkles,
} from 'lucide-react';

const ICONS = {
  sparkles: Sparkles,
  'image-off': ImageOff,
  gauge: Gauge,
  film: Film,
  palette: Palette,
  badge: BadgeCheck,
} as const;

/**
 * Reusable upgrade prompt. Opened from the canvas (locked resolution / remove
 * watermark / out of credits) and the dashboard. Sells the value props and
 * sends the user to /pricing.
 */
export function UpgradeDialog({
  open,
  onOpenChange,
  reason,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Short context, e.g. "Export in 2K & 4K with Pro." */
  reason?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5" />
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>

        {reason ? (
          <p className="-mt-1 text-sm text-muted-foreground">{reason}</p>
        ) : null}

        <div className="mt-1 space-y-3">
          {UPGRADE_VALUE_PROPS.map((v) => {
            const Icon = ICONS[v.icon] ?? Sparkles;
            return (
              <div key={v.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {v.title}
                  </div>
                  <div className="text-xs text-muted-foreground">{v.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            asChild
            className="flex-1 rounded-xl bg-foreground text-background hover:bg-neutral-800"
          >
            <LocaleLink href="/pricing">See plans &amp; upgrade</LocaleLink>
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Not now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
