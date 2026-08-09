import { AppShell } from '@/components/blocks/infogiph-home/app-shell';
import { Footer } from '@/components/blocks/infogiph-home/footer';
import { BreadcrumbJsonLd, JsonLd } from '@/components/seo/json-ld';
import { TemplateSearch } from '@/components/templates/template-search';
import { constructMetadata } from '@/lib/metadata';
import {
  allTemplates,
  getActiveCategories,
  getCategoryCount,
} from '@/lib/templates/catalog';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import Link from 'next/link';

const PATH = '/templates';
const TITLE = 'Infographic & Diagram Templates';
const SUBTITLE = `Browse ${allTemplates.length}+ free, editable infographic and diagram templates — architecture, data, AI, marketing, and more. Pick one and customise it in seconds with Infogiph.`;

export const metadata: Metadata = constructMetadata({
  title: `${TITLE} — ${allTemplates.length}+ Free Templates | Infogiph`,
  description:
    'Browse free, editable infographic and diagram templates across architecture, data, AI, business, marketing, DevOps and more. Search, customise, and export to GIF, MP4, or PNG.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent(TITLE)}&subtitle=${encodeURIComponent(`${allTemplates.length}+ free, editable templates you can customise in seconds.`)}`,
});

export default function TemplatesHubPage() {
  const cats = getActiveCategories();

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: TITLE,
    description: SUBTITLE,
    url: `${getBaseUrl()}${PATH}`,
    hasPart: cats.map((c) => ({
      '@type': 'CreativeWork',
      name: `${c.name} Templates`,
      url: `${getBaseUrl()}${PATH}/${c.key}`,
    })),
  };

  return (
    <AppShell>
      <JsonLd data={collectionJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Templates', href: PATH },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pb-2 pt-12 text-center md:px-6 md:pt-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Template Gallery
        </p>
        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          {TITLE}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {SUBTITLE}
        </p>
      </section>

      {/* Browse by category (crawlable links) */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h2 className="sr-only">Browse templates by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {cats.map((c) => (
            <Link
              key={c.key}
              href={`${PATH}/${c.key}`}
              className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
            >
              <span
                className="mb-2 block h-2 w-8 rounded-full"
                style={{ background: c.accent }}
              />
              <span className="block text-sm font-semibold text-foreground">
                {c.label}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {getCategoryCount(c.key)} templates
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Searchable grid of all templates */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <TemplateSearch
          templates={allTemplates}
          categories={cats}
          placeholder={`Search ${allTemplates.length} templates…`}
        />
      </section>

      <Footer />
    </AppShell>
  );
}
