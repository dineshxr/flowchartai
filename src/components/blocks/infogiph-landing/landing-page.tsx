import { AppShell } from '@/components/blocks/infogiph-home/app-shell';
import { Footer } from '@/components/blocks/infogiph-home/footer';
import { TrustBar } from '@/components/blocks/infogiph-home/trust-bar';
import { InfogiphHowItWorks } from '@/components/blocks/infogiph-how-it-works/infogiph-how-it-works';
import { InfogiphTestimonials } from '@/components/blocks/infogiph-testimonials/infogiph-testimonials';
import { getBaseUrl } from '@/lib/urls/urls';
import Link from 'next/link';

export interface LandingBenefit {
  title: string;
  body: string;
}

export interface LandingProseSection {
  heading: string;
  paragraphs: string[];
}

export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingRelatedLink {
  label: string;
  href: string;
}

export interface LandingPageProps {
  /** Small label above the H1, e.g. "AI Infographic Maker" */
  eyebrow?: string;
  /** The page H1 — should contain the primary keyword */
  title: string;
  /** Supporting subheadline under the H1 */
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  /** Benefit cards */
  benefits: LandingBenefit[];
  /** Long-form SEO body, rendered as H2 + paragraphs */
  body: LandingProseSection[];
  /** FAQ items — also emitted as FAQPage JSON-LD for rich results */
  faqs: LandingFaq[];
  /** Internal links to related pages (for link equity) */
  related?: LandingRelatedLink[];
  /** Path of this page, used for the WebPage JSON-LD url */
  canonicalPath: string;
}

export function LandingPage({
  eyebrow,
  title,
  subtitle,
  ctaText = 'Create your infographic free',
  ctaHref = '/canvas',
  secondaryCtaText = 'See how it works',
  secondaryCtaHref = '#how-it-works',
  benefits,
  body,
  faqs,
  related,
  canonicalPath,
}: LandingPageProps) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: subtitle,
    url: `${getBaseUrl()}${canonicalPath}`,
  };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is required as a string
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is required as a string
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 md:px-6 pt-12 md:pt-20 pb-6 text-center">
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
          {title}
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {ctaText}
          </Link>
          <Link
            href={secondaryCtaHref}
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            {secondaryCtaText}
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Free to start · No credit card · Export to SVG, PNG, GIF &amp; MP4
        </p>
      </section>

      <TrustBar />

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="ig-gradient mb-4 h-9 w-9 rounded-xl" />
              <h3 className="text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div id="how-it-works">
        <InfogiphHowItWorks />
      </div>

      {/* SEO body copy */}
      <section className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-20">
        <div className="flex flex-col gap-10">
          {body.map((section) => (
            <div key={section.heading}>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-4">
                {section.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 32)}
                    className="text-base text-muted-foreground leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <InfogiphTestimonials />

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="flex flex-col divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium list-none">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-4 md:px-6 pb-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Ready to make your first infographic?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Describe it in a sentence and watch Infogiph build it in seconds.
        </p>
        <Link
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {ctaText}
        </Link>

        {related && related.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                {r.label}
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </AppShell>
  );
}
