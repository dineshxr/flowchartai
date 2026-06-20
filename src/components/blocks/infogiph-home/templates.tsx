import { TemplateCard } from '@/components/templates/template-card';
import {
  allTemplates,
  getActiveCategories,
  getTemplatesByCategory,
} from '@/lib/templates/catalog';
import Link from 'next/link';

// Featured teaser for the home page — one diverse template per category, with
// the full searchable gallery living at /templates.
export function Templates() {
  const cats = getActiveCategories();
  const featured = cats
    .slice(0, 8)
    .map((c) => getTemplatesByCategory(c.key)[0])
    .filter(Boolean);

  return (
    <section className="px-4 pb-10 md:px-6">
      <div className="mx-auto max-w-7xl pt-2">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              Start from a template
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {allTemplates.length}+ editable diagram &amp; infographic
              templates, ready to customise.
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
        <div className="scrollbar-hide mb-6 flex items-center gap-1 overflow-x-auto pb-1">
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

        {/* Featured grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((t) => (
            <TemplateCard key={t.slug} template={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
