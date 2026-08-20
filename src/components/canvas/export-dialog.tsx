'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PLAN_BY_ID, type PlanId } from '@/config/plans';
import {
  EXPORT_PRESETS,
  type ExportPreset,
  type ExportStage,
} from '@/hooks/use-export';
import { LocaleLink } from '@/i18n/navigation';
import { startCheckout } from '@/lib/stripe/checkout';
import { cn } from '@/lib/utils';
import {
  Check,
  Download,
  FileCode2,
  FileImage,
  Film,
  ImageOff,
  Loader2,
  Sparkles,
  Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export type ExportFormat = 'gif' | 'mp4' | 'png' | 'svg';

/**
 * What each format is and who it's for. Shown in the modal so the user isn't
 * guessing what they're about to download — the old flow made them pick a
 * resolution tier before they knew what the file even was.
 */
export const EXPORT_FORMATS: Record<
  ExportFormat,
  {
    label: string;
    short: string;
    blurb: string;
    icon: typeof Film;
    animated: boolean;
  }
> = {
  gif: {
    label: 'Animated GIF',
    short: 'GIF',
    blurb: 'Loops seamlessly and plays anywhere — LinkedIn, X, Slack, Notion.',
    icon: Film,
    animated: true,
  },
  mp4: {
    label: 'Video (MP4)',
    short: 'MP4',
    blurb:
      'Sharper than GIF at a fraction of the size — decks, YouTube, Reels.',
    icon: Video,
    animated: true,
  },
  png: {
    label: 'Static image (PNG)',
    short: 'PNG',
    blurb: 'A single high-resolution frame for docs, slides and thumbnails.',
    icon: FileImage,
    animated: false,
  },
  svg: {
    label: 'SVG snapshot',
    short: 'SVG',
    blurb: 'A high-resolution frame wrapped as SVG — drops into Figma & docs.',
    icon: FileCode2,
    animated: false,
  },
};

/** Human-readable dimensions for a preset, or a note for pass-through sizing. */
function presetDims(preset: ExportPreset, scale = 1): string {
  const p = EXPORT_PRESETS[preset];
  return p.w && p.h ? `${p.w * scale} × ${p.h * scale}` : 'Matches the canvas';
}

/** Short chip label — "1:1 Square (1080×1080)" → "1:1 Square". */
function presetChip(preset: ExportPreset): string {
  return EXPORT_PRESETS[preset].label.split(' (')[0];
}

const STAGE_COPY: Record<ExportStage, string> = {
  idle: 'Exporting…',
  preparing: 'Preparing export…',
  rendering: 'Rendering frames…',
  encoding: 'Encoding…',
  finalizing: 'Finishing up…',
};

/**
 * The one place an export is configured and confirmed.
 *
 * Opens once the user has picked a file type, so it can speak concretely
 * ("Export as animated GIF") instead of offering an abstract matrix of
 * formats × resolutions up front. For free users it doubles as the paywall
 * moment: the watermark is about to be stamped on the thing they just made,
 * which is when removing it is worth the most.
 */
export function ExportDialog({
  open,
  onOpenChange,
  format,
  preset,
  onPresetChange,
  scale,
  onScaleChange,
  transparent,
  onTransparentChange,
  plan,
  isExporting,
  exportProgress,
  exportStage,
  onExport,
  onCancelExport,
  returnTo,
  onBeforeCheckout,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  format: ExportFormat;
  preset: ExportPreset;
  onPresetChange: (preset: ExportPreset) => void;
  /** Output resolution multiplier (1 = standard, 2 = HD; HD is plan-gated). */
  scale: number;
  onScaleChange: (scale: number) => void;
  /** Transparent background — offered for PNG/SVG only. */
  transparent: boolean;
  onTransparentChange: (transparent: boolean) => void;
  plan: PlanId;
  isExporting: boolean;
  exportProgress: number;
  exportStage: ExportStage;
  onExport: () => void;
  onCancelExport: () => void;
  /** Path to return to after Stripe checkout (the canvas being edited). */
  returnTo?: string;
  /** Save the diagram before leaving for checkout; may return a better path. */
  onBeforeCheckout?: () => undefined | string | Promise<string | undefined>;
}) {
  const [yearly, setYearly] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  // A free user tapped the locked HD chip — call HD out in the upgrade pitch.
  // Reset when the dialog closes so the next open starts on the watermark line.
  const [hdNudge, setHdNudge] = useState(false);
  useEffect(() => {
    if (!open) setHdNudge(false);
  }, [open]);

  const meta = EXPORT_FORMATS[format];
  const Icon = meta.icon;
  const watermarked = PLAN_BY_ID[plan].limits.watermark;
  const hdLocked = !PLAN_BY_ID[plan].limits.hdExport;
  const pro = PLAN_BY_ID.pro;
  const price = yearly ? pro.priceYearlyMonthly : pro.priceMonthly;
  // GIFs always export at 1× (a 4K GIF is a payload nobody wants); PNG/SVG are
  // the only formats where a transparent backdrop makes sense.
  const supportsHd = format !== 'gif';
  const supportsTransparent = format === 'png' || format === 'svg';
  const effectiveScale = supportsHd && !hdLocked ? scale : 1;

  const onUpgrade = async () => {
    setCheckingOut(true);
    try {
      let dest = returnTo;
      if (onBeforeCheckout) {
        // Save first so "pick up where you left off" is true — but never let a
        // slow save block the purchase.
        const saved = await Promise.race([
          Promise.resolve(onBeforeCheckout()).catch(() => undefined),
          new Promise<undefined>((resolve) => setTimeout(resolve, 4000)),
        ]);
        if (typeof saved === 'string' && saved.startsWith('/')) dest = saved;
      }
      await startCheckout('pro', yearly ? 'year' : 'month', { returnTo: dest });
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <Dialog
      open={open}
      // An export in flight owns the dialog — closing it would orphan the run.
      onOpenChange={(next) => {
        if (!next && isExporting) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
              <Icon className="h-5 w-5" />
            </span>
            Export as {meta.label.toLowerCase()}
          </DialogTitle>
        </DialogHeader>

        <p className="-mt-1 text-sm text-muted-foreground">{meta.blurb}</p>

        {/* ── Size ─────────────────────────────────────────────────────── */}
        <div className="mt-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Size
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(Object.keys(EXPORT_PRESETS) as ExportPreset[]).map((k) => {
              const active = preset === k;
              return (
                <button
                  key={k}
                  type="button"
                  disabled={isExporting}
                  onClick={() => onPresetChange(k)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:opacity-50',
                    active
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-background text-foreground/70 hover:border-foreground/40 hover:text-foreground'
                  )}
                >
                  {presetChip(k)}
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-xs tabular-nums text-muted-foreground">
            {presetDims(preset, effectiveScale)}
          </div>
        </div>

        {/* ── Quality / background ─────────────────────────────────────── */}
        <div className="mt-2">
          {supportsHd ? (
            <>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Quality
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => onScaleChange(1)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:opacity-50',
                    effectiveScale === 1
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-background text-foreground/70 hover:border-foreground/40 hover:text-foreground'
                  )}
                >
                  Standard
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  aria-disabled={hdLocked}
                  title={
                    hdLocked
                      ? 'HD 2× export is a Pro feature'
                      : 'Double the output resolution'
                  }
                  onClick={() =>
                    hdLocked ? setHdNudge(true) : onScaleChange(2)
                  }
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:opacity-50',
                    effectiveScale === 2
                      ? 'border-foreground bg-foreground text-background'
                      : hdLocked
                        ? 'border-border bg-background text-foreground/40'
                        : 'border-border bg-background text-foreground/70 hover:border-foreground/40 hover:text-foreground'
                  )}
                >
                  HD 2×
                  {hdLocked ? (
                    <span className="ig-gradient rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-white">
                      Pro
                    </span>
                  ) : null}
                </button>
              </div>
            </>
          ) : null}

          {/* Background is always visible — a lone toggle hidden behind the
                right format was undiscoverable. Unsupported formats show it
                disabled with the reason instead of hiding it. */}
          <div
            className={cn(
              'text-[11px] font-semibold uppercase tracking-wider text-muted-foreground',
              supportsHd && 'mt-3'
            )}
          >
            Background
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              disabled={isExporting}
              onClick={() => onTransparentChange(false)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:opacity-50',
                !transparent || !supportsTransparent
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-foreground/70 hover:border-foreground/40 hover:text-foreground'
              )}
            >
              White
            </button>
            <button
              type="button"
              disabled={isExporting || !supportsTransparent}
              title={
                supportsTransparent
                  ? 'Export with a see-through background'
                  : 'Transparent background is available for PNG and SVG'
              }
              onClick={() => onTransparentChange(true)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]',
                transparent && supportsTransparent
                  ? 'border-foreground bg-foreground text-background'
                  : supportsTransparent
                    ? 'border-border bg-background text-foreground/70 hover:border-foreground/40 hover:text-foreground'
                    : 'cursor-not-allowed border-border bg-background text-foreground/40'
              )}
            >
              {transparent && supportsTransparent ? (
                <Check className="h-3.5 w-3.5" />
              ) : null}
              Transparent
            </button>
          </div>
          {!supportsTransparent ? (
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Transparent background is available for PNG and SVG exports.
            </p>
          ) : null}
        </div>

        {/* ── Watermark / upgrade ──────────────────────────────────────── */}
        {watermarked ? (
          <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3">
            <div className="flex items-start gap-2.5">
              <ImageOff className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">
                  {hdNudge
                    ? 'HD 2× export is a Pro feature'
                    : 'This export will carry the Infogiph watermark'}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {hdNudge
                    ? 'Pro unlocks 4K-class exports, removes the watermark from every download, and gives you '
                    : 'Pro removes it from every export, unlocks HD 2×, and gives you '}
                  {pro.limits.aiGenerations} AI generations a month instead of
                  the {PLAN_BY_ID.free.limits.aiGenerations} you get free.
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2">
              <div className="inline-flex items-center rounded-full border border-border bg-background p-0.5">
                <button
                  type="button"
                  onClick={() => setYearly(false)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium transition-[color,background-color] duration-150 ease-out',
                    !yearly
                      ? 'bg-foreground text-background'
                      : 'text-foreground/60 hover:text-foreground'
                  )}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setYearly(true)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium transition-[color,background-color] duration-150 ease-out',
                    yearly
                      ? 'bg-foreground text-background'
                      : 'text-foreground/60 hover:text-foreground'
                  )}
                >
                  Yearly
                </button>
              </div>
              <Button
                size="sm"
                onClick={onUpgrade}
                disabled={checkingOut || isExporting}
                className="ig-gradient gap-1.5 rounded-lg text-white shadow-[0_2px_10px_rgba(255,107,157,0.35)] hover:opacity-95"
              >
                {checkingOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    {hdNudge
                      ? `Unlock HD — $${price}/mo`
                      : `Remove watermark — $${price}/mo`}
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            No watermark — you&rsquo;re on {PLAN_BY_ID[plan].name}.
          </div>
        )}

        {/* ── Progress / actions ───────────────────────────────────────── */}
        {isExporting ? (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground/70" />
                {STAGE_COPY[exportStage]}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {exportProgress}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full w-full origin-left rounded-full bg-foreground transition-transform duration-200 ease-out"
                style={{ transform: `scaleX(${exportProgress / 100})` }}
              />
            </div>
            <Button
              variant="outline"
              onClick={onCancelExport}
              className="mt-3 w-full rounded-xl"
            >
              Cancel export
            </Button>
          </div>
        ) : (
          <div className="mt-3 flex gap-2">
            <Button
              onClick={onExport}
              className="flex-1 gap-2 rounded-xl bg-foreground text-background hover:bg-neutral-800"
            >
              <Download className="h-4 w-4" />
              Export {meta.short}
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        )}

        {watermarked && !isExporting ? (
          <p className="text-center text-xs text-muted-foreground">
            Your work is saved — checkout brings you right back here.{' '}
            <LocaleLink
              href="/pricing"
              className="underline hover:text-foreground"
            >
              Compare plans
            </LocaleLink>
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
