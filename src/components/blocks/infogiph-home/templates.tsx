'use client';

import { allTemplates, getActiveCategories } from '@/lib/templates/catalog';
import Link from 'next/link';
import { showcaseGallery, showcaseHeroes } from './template-icons';
import { ShowcaseCard } from './template-showcase-card';

// Animated template showcase for the home page. Three brand-rich "key examples"
// headline the section, followed by a varied-size masonry that fans out across
// every layout (hub, pipeline, radial, tree) and animation style (beams, dots,
// arrows, pulses). The full searchable catalog lives at /templates.
export function Templates() {
  const cats = getActiveCategories();

  return (
    <section className="px-4 pb-12 md:px-6">
      <div className="mx-auto max-w-7xl pt-2">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              Start from a template
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {allTemplates.length}+ editable, animated diagram &amp;
              infographic templates — pick a style and make it yours.
            </p>
          </div>
          <Link
            href="/templates"
            className="shrink-0 whitespace-nowrap rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-[#fafafa]"
          >
            Browse all →
          </Link>
        </div>

        {/* Category links */}
        <div className="scrollbar-hide mb-7 flex items-center gap-1 overflow-x-auto pb-1">
          {cats.map((c) => (
            <Link
              key={c.key}
              href={`/templates/${c.key}`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/70 transition-all hover:bg-[#fafafa] hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* Featured "key examples" band */}
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
          {showcaseHeroes.map((item) => (
            <ShowcaseCard key={item.key} item={item} featured />
          ))}
        </div>

        {/* Varied-size animated masonry */}
        <div className="gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {showcaseGallery.map((item) => (
            <div key={item.key} className="mb-4 break-inside-avoid">
              <ShowcaseCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
