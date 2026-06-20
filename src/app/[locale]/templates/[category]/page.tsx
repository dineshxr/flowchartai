import { AppShell } from '@/components/blocks/infogiph-home/app-shell';
import { Footer } from '@/components/blocks/infogiph-home/footer';
import { BreadcrumbJsonLd, JsonLd } from '@/components/seo/json-ld';
import { TemplateSearch } from '@/components/templates/template-search';
import { LOCALES } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import {
  getActiveCategories,
  getCategory,
  getTemplatesByCategory,
} from '@/lib/templates/catalog';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: Locale; category: string }>;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getActiveCategories().map((c) => ({ locale, category: c.key }))
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return constructMetadata({ noIndex: true });

  const count = getTemplatesByCategory(category).length;
  const title = `${cat.name} Diagram Templates`;
  return constructMetadata({
    title: `${title} — ${count} Free Templates | Infogiph`,
    description: cat.description,
    canonicalUrl: `${getBaseUrl()}/templates/${cat.key}`,
    image: `/api/og?title=${encodeURIComponent(`${cat.label} Templates`)}&subtitle=${encodeURIComponent(cat.tagline)}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const templates = getTemplatesByCategory(category);
  if (templates.length === 0) notFound();

  const otherCats = getActiveCategories().filter((c) => c.key !== category);
  const basePath = `/templates/${cat.key}`;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name} Diagram Templates`,
    description: cat.description,
    url: `${getBaseUrl()}${basePath}`,
    hasPart: templates.map((t) => ({
      '@type': 'CreativeWork',
      name: t.title,
      url: `${getBaseUrl()}/templates/${t.category}/${t.slug}`,
    })),
  };

  return (
    <AppShell>
      <JsonLd data={collectionJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Templates', href: '/templates' },
          { name: cat.label, href: basePath },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pb-2 pt-12 text-center md:px-6 md:pt-20">
        <nav
          className="mb-4 text-xs text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/templates" className="hover:text-foreground">
            Templates
          </Link>{' '}
          / <span className="text-foreground">{cat.label}</span>
        </nav>
        <span
          className="mx-auto mb-4 block h-2 w-12 rounded-full"
          style={{ background: cat.accent }}
        />
        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          {cat.name} Templates
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {cat.description}
        </p>
      </section>

      {/* Searchable grid (scoped to this category) */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <TemplateSearch
          templates={templates}
          placeholder={`Search ${cat.label} templates…`}
        />
      </section>

      {/* Other categories */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Browse other categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherCats.map((c) => (
            <Link
              key={c.key}
              href={`/templates/${c.key}`}
              className="inline-flex items-center rounded-full border border-border px-3.5 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-[#fafafa] hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </AppShell>
  );
}
