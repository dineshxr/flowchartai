'use client';

import Link from 'next/link';
import { AnimatedPreview } from './animated-preview';
import type { ShowcaseItem } from './template-icons';

// One animated template tile. The card frame is locked to the diagram's native
// aspect ratio (item.dims), so AnimatedPreview's "home" layer can fill it edge
// to edge with no letterboxing — the SVG beams and the icon tiles stay aligned
// at any card width.
export function ShowcaseCard({
  item,
  featured = false,
}: {
  item: ShowcaseItem;
  featured?: boolean;
}) {
  const { spec, dims, title, desc, href } = item;

  return (
    <Link
      href={href}
      className="group block w-full text-left"
      aria-label={`Open the ${title} template`}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(15,42,62,0.06)] transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-foreground/15 group-hover:shadow-[0_18px_40px_-16px_rgba(15,42,62,0.35)]"
        style={{ aspectRatio: `${dims.W} / ${dims.H}` }}
      >
        <AnimatedPreview
          {...spec}
          variant="home"
          dims={dims}
          showModeChip={false}
        />

        {/* animation-style chip */}
        <span className="pointer-events-none absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-border bg-white/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/70 shadow-sm backdrop-blur">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: spec.accent || '#ff5b8a' }}
          />
          {spec.mode}
        </span>

        {/* hover CTA */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/45 via-black/10 to-transparent px-3 pb-2.5 pt-8 text-[11px] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Use this template
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>

      <h3
        className={
          'mt-3 line-clamp-1 font-semibold text-foreground transition-colors group-hover:text-black ' +
          (featured ? 'text-sm sm:text-base' : 'text-[13px] sm:text-sm')
        }
      >
        {title}
      </h3>
      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
        {desc}
      </p>
    </Link>
  );
}
