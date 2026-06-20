'use client';

import { AnimatedPreview } from '@/components/blocks/infogiph-home/animated-preview';
import { accentForCategory } from '@/lib/templates/catalog';
import { derivePreviewSpec } from '@/lib/templates/preview';
import type { Template } from '@/lib/templates/types';
import { useEffect, useRef, useState } from 'react';

// AnimatedPreview's "home" variant is designed for a compact 240x320 frame and
// renders cleanly there. We render it at that native size and scale the whole
// frame uniformly to fill the hero, so tiles/labels never overlap (the "canvas"
// variant assumes the tall full-screen editor and crowds in a short box).
const BASE_W = 240;
const BASE_H = 320;

/** Full animated hero preview for a template detail page (one per page). */
export function TemplatePreview({ template }: { template: Template }) {
  const accent = accentForCategory(template.category);
  const spec = derivePreviewSpec(template, accent);
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / BASE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-border bg-card"
      style={{ aspectRatio: `${BASE_W} / ${BASE_H}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}
      >
        <AnimatedPreview {...spec} variant="home" showModeChip={false} />
      </div>
    </div>
  );
}
