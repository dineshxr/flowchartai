// Social-proof bar shown directly under the Hero. Mirrors the "Trusted by
// professionals at" pattern used by tools like MagicSlides. Renders real
// company logos (from svgl, stored in /public/logos) in a muted, grayscale
// treatment that pops to full color on hover.

import { BrandLogo, TRUST_BRANDS } from '@/components/brand-logos';

export function TrustBar() {
  return (
    <section className="px-4 md:px-6 pt-2 pb-8 md:pb-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs md:text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Trusted by professionals at
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-9 gap-y-5 md:gap-x-12">
          {TRUST_BRANDS.map((b) => (
            <div
              key={b.slug}
              className="flex items-center gap-2 opacity-60 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
            >
              <BrandLogo
                slug={b.slug}
                name={b.name}
                decorative
                className="h-6 w-auto md:h-7"
              />
              <span className="text-base md:text-lg font-semibold tracking-tight text-foreground/70">
                {b.name}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Product, engineering, and design teams use Infogiph to turn ideas into
          clear, shareable diagrams — in seconds.
        </p>
      </div>
    </section>
  );
}
