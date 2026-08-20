'use client';

import {
  AnimatedPreview,
  type Dims,
  HOME_DIMS,
  type PreviewSpec,
  SQUARE_DIMS,
  TALL_DIMS,
  WIDE_DIMS,
} from '@/components/blocks/infogiph-home/animated-preview';
import { accentForCategory } from '@/lib/templates/catalog';
import { derivePreviewSpec } from '@/lib/templates/preview';
import type { Template } from '@/lib/templates/types';
import { useEffect, useRef, useState } from 'react';

// Pick a native frame that suits the layout, then render AnimatedPreview at that
// size and scale the whole frame uniformly to fill the hero — so tiles/labels
// never overlap. Horizontal layouts (pipeline, hub-lr) need a WIDE frame; a
// portrait frame crowds their row/columns (radial & tree are happy portrait).
function dimsForLayout(layout: PreviewSpec['layout']): Dims {
  if (layout === 'pipeline' || layout === 'hub-lr') return WIDE_DIMS;
  if (layout === 'tree') return TALL_DIMS;
  // Charts read left→right (bars/line) or need a square ring (donut).
  if (layout === 'bars' || layout === 'chart-line') return WIDE_DIMS;
  if (layout === 'donut' || layout === 'iso-steps') return SQUARE_DIMS;
  return HOME_DIMS; // radial
}

/** Full animated hero preview for a template detail page (one per page). */
export function TemplatePreview({ template }: { template: Template }) {
  const accent = accentForCategory(template.category);
  const spec = derivePreviewSpec(template, accent);
  const dims = dimsForLayout(spec.layout);
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / dims.W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dims.W]);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-border bg-card"
      style={{ aspectRatio: `${dims.W} / ${dims.H}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: dims.W, height: dims.H, transform: `scale(${scale})` }}
      >
        <AnimatedPreview
          {...spec}
          variant="home"
          dims={dims}
          showModeChip={false}
        />
      </div>
    </div>
  );
}
