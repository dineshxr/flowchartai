import { AppShell } from '@/components/blocks/infogiph-home/app-shell';
import { Footer } from '@/components/blocks/infogiph-home/footer';
import { BreadcrumbJsonLd, JsonLd } from '@/components/seo/json-ld';
import { TemplateCard } from '@/components/templates/template-card';
import { TemplatePreview } from '@/components/templates/template-preview';
import { LOCALES } from '@/i18n/routing';
import { constructMetadata } from '@/lib/metadata';
import {
  accentForCategory,
  allTemplates,
  getCategory,
  getRelatedTemplates,
  getTemplateBySlug,
  isTreeData,
} from '@/lib/templates/catalog';
import type { DiagramData } from '@/lib/templates/types';
import { getBaseUrl } from '@/lib/urls/urls';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: Locale; category: string; slug: string }>;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    allTemplates.map((t) => ({
      locale,
      category: t.category,
      slug: t.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return constructMetadata({ noIndex: true });

  // Avoid "... Template Template" when the title already ends in Template.
  const titleBase = /template$/i.test(template.title.trim())
    ? template.title
    : `${template.title} Template`;

  return constructMetadata({
    title: `${titleBase} — Free & Editable | Infogiph`,
    description: `${template.shortDescription}. ${template.categoryName} template you can customise in seconds and export to PNG, SVG, GIF, or MP4 — free with Infogiph.`,
    canonicalUrl: `${getBaseUrl()}/templates/${template.category}/${template.slug}`,
    image: `/api/og?title=${encodeURIComponent(template.title)}&subtitle=${encodeURIComponent(template.shortDescription)}`,
  });
}

function componentLabels(data: DiagramData): string[] {
  if (isTreeData(data)) {
    return (data.root.children || []).flatMap((c) => [
      c.label,
      ...(c.children || []).map((g) => g.label),
    ]);
  }
  return data.satellites.map((s) => s.label);
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template || template.category !== category) notFound();

  const cat = getCategory(template.category);
  const accent = accentForCategory(template.category);
  const related = getRelatedTemplates(template, 8);
  const components = componentLabels(template.data);
  const paragraphs = template.longDescription.split(/\n\n+/).filter(Boolean);
  const canvasHref = `/canvas?template=${template.slug}`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: template.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <AppShell>
      <JsonLd data={faqJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Templates', href: '/templates' },
          {
            name: cat?.label || template.categoryName,
            href: `/templates/${template.category}`,
          },
          {
            name: template.title,
            href: `/templates/${template.category}/${template.slug}`,
          },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-16">
        <nav
          className="mb-6 text-xs text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/templates" className="hover:text-foreground">
            Templates
          </Link>{' '}
          /{' '}
          <Link
            href={`/templates/${template.category}`}
            className="hover:text-foreground"
          >
            {cat?.label || template.categoryName}
          </Link>{' '}
          / <span className="text-foreground">{template.title}</span>
        </nav>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <Link
              href={`/templates/${template.category}`}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: accent }}
              />
              {cat?.label || template.categoryName}
            </Link>
            <h1 className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
              {template.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {template.shortDescription}.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={canvasHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" />
                Use this template
              </Link>
              <Link
                href="/canvas"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Start from scratch
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Free to start · Fully editable · Export to SVG, PNG, GIF &amp; MP4
            </p>
          </div>

          <TemplatePreview template={template} />
        </div>
      </section>

      {/* What's inside */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          What&apos;s in this template
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {components.length} connected{' '}
          {components.length === 1 ? 'component' : 'components'} you can rename,
          recolor, and extend with AI.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {components.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: accent }}
              />
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* About + use cases */}
      <section className="mx-auto max-w-3xl px-4 pb-4 md:px-6">
        <div className="flex flex-col gap-4">
          {paragraphs.map((p) => (
            <p
              key={p.slice(0, 32)}
              className="text-base leading-relaxed text-muted-foreground"
            >
              {p}
            </p>
          ))}
        </div>

        {template.useCases.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold tracking-tight">Great for</h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {template.useCases.map((u) => (
                <li
                  key={u}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <ArrowRight
                    className="h-4 w-4 shrink-0"
                    style={{ color: accent }}
                  />
                  {u}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* FAQ */}
      {template.faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="flex flex-col divide-y divide-border border-y border-border">
            {template.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                  {f.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related templates */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              Related templates
            </h2>
            <Link
              href={`/templates/${template.category}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View all {cat?.label} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {related.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-4 pb-20 text-center md:px-6">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Make it yours in seconds
        </h2>
        <p className="mt-3 text-muted-foreground">
          Open the {template.title.toLowerCase()} in the Infogiph canvas, then
          edit, animate, and export.
        </p>
        <Link
          href={canvasHref}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          Use this template
        </Link>
      </section>

      <Footer />
    </AppShell>
  );
}
