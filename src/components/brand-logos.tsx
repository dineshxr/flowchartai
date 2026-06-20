// Brand logo library. Real company logos (SVG) sourced from svgl.app
// (https://github.com/pheralb/svgl) and stored in /public/logos/<slug>.svg.
// Used for the "Trusted by" bar and testimonial attributions instead of
// plain-text brand names.

export interface Brand {
  slug: string;
  name: string;
}

/** Companies shown in the homepage / landing "Trusted by professionals at" bar. */
export const TRUST_BRANDS: Brand[] = [
  { slug: 'google', name: 'Google' },
  { slug: 'microsoft', name: 'Microsoft' },
  { slug: 'notion', name: 'Notion' },
  { slug: 'stripe', name: 'Stripe' },
  { slug: 'atlassian', name: 'Atlassian' },
  { slug: 'spotify', name: 'Spotify' },
  { slug: 'figma', name: 'Figma' },
];

/** Map a display company name to its logo slug (for testimonials, etc.). */
export const BRAND_SLUG_BY_NAME: Record<string, string> = {
  Google: 'google',
  Microsoft: 'microsoft',
  Notion: 'notion',
  Stripe: 'stripe',
  Atlassian: 'atlassian',
  Spotify: 'spotify',
  Figma: 'figma',
};

/**
 * Renders a single brand logo as an <img>. SVGs are self-contained, so a plain
 * <img> keeps things simple and lets CSS filters (e.g. grayscale) apply.
 *
 * Set `decorative` when the brand name is already shown as adjacent text — the
 * logo then gets an empty alt + aria-hidden so screen readers don't read it
 * twice (WCAG).
 */
export function BrandLogo({
  slug,
  name,
  className,
  decorative = false,
}: {
  slug: string;
  name: string;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <img
      src={`/logos/${slug}.svg`}
      alt={decorative ? '' : `${name} logo`}
      aria-hidden={decorative || undefined}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
