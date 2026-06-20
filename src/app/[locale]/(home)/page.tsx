import { AppShell } from '@/components/blocks/infogiph-home/app-shell';
import { Faq } from '@/components/blocks/infogiph-home/faq';
import { Features } from '@/components/blocks/infogiph-home/features';
import { Footer } from '@/components/blocks/infogiph-home/footer';
import { Hero } from '@/components/blocks/infogiph-home/hero';
import { Templates } from '@/components/blocks/infogiph-home/templates';
import { TrustBar } from '@/components/blocks/infogiph-home/trust-bar';
import { InfogiphHowItWorks } from '@/components/blocks/infogiph-how-it-works/infogiph-how-it-works';
import { InfogiphTestimonials } from '@/components/blocks/infogiph-testimonials/infogiph-testimonials';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

export const metadata: Metadata = constructMetadata({
  title: 'AI Infographic Generator — Make Infographics from Text | Infogiph',
  description:
    'Infogiph is an AI infographic generator that turns plain text into polished, animated infographics in seconds. Create, edit, and export infographics as PNG, SVG, GIF, or MP4 — free to start, no design skills needed.',
  canonicalUrl: `${getBaseUrl()}/`,
  image: `/api/og?title=${encodeURIComponent('AI Infographic Generator')}&subtitle=${encodeURIComponent('Turn text into polished, animated infographics in seconds.')}`,
});

export default function HomePage() {
  return (
    <AppShell>
      <Hero />
      <TrustBar />
      <InfogiphHowItWorks />
      <Templates />
      <Features />
      <InfogiphTestimonials />
      <Faq />
      <Footer />
    </AppShell>
  );
}
