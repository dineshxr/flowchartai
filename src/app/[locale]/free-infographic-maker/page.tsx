import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/free-infographic-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free Infographic Maker — Make Infographics Online Free | Infogiph',
  description:
    'A genuinely free online infographic maker. Type a sentence and Infogiph builds an animated infographic in seconds — no design skills, no credit card. Export to PNG, SVG, GIF, and MP4 for free.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('Free Infographic Maker')}&subtitle=${encodeURIComponent('Make infographics online, free — no credit card.')}`,
});

export default function FreeInfographicMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Free Online Infographic Maker"
      title="Make infographics online, free"
      subtitle="Infogiph is a free online infographic maker powered by AI. Describe your idea in a sentence and get a polished, animated infographic in seconds — no credit card, no design background, no steep learning curve."
      ctaText="Make an infographic free"
      benefits={[
        {
          title: 'Free to start, instantly',
          body: 'No credit card and no trial countdown. Open Infogiph, describe what you want, and generate your first infographic in under a minute.',
        },
        {
          title: 'Real exports on the free plan',
          body: 'Download finished infographics as PNG, SVG, GIF, or MP4. Share them in decks, docs, blog posts, and social — no broken, half-finished free files.',
        },
        {
          title: 'AI does the design work',
          body: 'The free infographic maker handles layout, icons, color, and spacing automatically, so your graphics look designed even if you are not a designer.',
        },
        {
          title: 'Animated infographics free',
          body: 'Free infographics still animate — connections and nodes reveal flow and hierarchy through motion, not just static boxes.',
        },
        {
          title: 'Edit everything',
          body: 'Tweak any node, label, icon, or color. Re-run AI on a section until it is right. Full editing is included at no cost.',
        },
        {
          title: 'Upgrade only if you need more',
          body: 'The free plan covers everyday use. When you need higher volume, watermark-free files, or 2K/4K exports, paid plans start small.',
        },
      ]}
      body={[
        {
          heading: 'What "free" actually means with Infogiph',
          paragraphs: [
            'Plenty of free infographic makers let you design something for free, then lock the download behind a paywall. Infogiph keeps the free plan genuinely useful: free AI generations, the full editor, and real exports in every format — PNG, SVG, GIF, and MP4 at 1080p.',
            'You only need a paid plan when you outgrow the free limits — for example, generating dozens of infographics a week, removing the small Infogiph watermark, or exporting 2K and 4K video.',
          ],
        },
        {
          heading: 'Make an infographic online in three steps',
          paragraphs: [
            'First, describe what you want to visualize — a process, a system, a comparison, or an org structure. Second, let the AI generate a complete, animated infographic with icons and labels. Third, edit anything you like and export it. The whole flow happens in your browser, free.',
            'Because there is nothing to install, this free online infographic maker works on a laptop, a borrowed computer, or a tablet — your projects follow you.',
          ],
        },
        {
          heading: 'Who uses the free infographic maker',
          paragraphs: [
            'Students turning notes into study visuals, founders explaining how their product works, marketers creating shareable graphics, and teams documenting systems all use Infogiph for free. No design experience required — if you can describe it, Infogiph can draw it.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is Infogiph really a free infographic maker?',
          a: 'Yes. The free plan includes 5 AI generations, the full editor, and 5 real exports — PNG, SVG, GIF, and MP4 — with no credit card required to start.',
        },
        {
          q: 'Do free infographics have a watermark?',
          a: 'Free exports carry a small Infogiph watermark. Upgrading to a paid plan removes it and unlocks 2K/4K resolution.',
        },
        {
          q: 'What is the catch with the free plan?',
          a: 'The free plan is capped at 5 AI generations and 5 exports, at 1080p with a small watermark. If you make infographics regularly, you can upgrade — but trying it properly costs nothing.',
        },
        {
          q: 'Can I make infographics online without downloading software?',
          a: 'Yes. Infogiph is entirely browser-based, so you can make an infographic online from any device with no installation.',
        },
        {
          q: 'Is it free for commercial use?',
          a: 'You can use infographics you create on the free plan in your own content, decks, and posts. Review the terms for full details.',
        },
        {
          q: 'How fast can I make a free infographic?',
          a: 'Most infographics generate in 5–15 seconds. Editing and re-exporting are instant.',
        },
      ]}
      related={[
        { label: 'Infographic Maker', href: '/infographic-maker' },
        { label: 'Infographic Video Maker', href: '/infographic-video-maker' },
        {
          label: 'Free Infographic Video Maker',
          href: '/free-infographic-video-maker',
        },
        {
          label: 'Free AI infographic generator',
          href: '/blog/free-ai-infographic-generator-from-text',
        },
        {
          label: 'How to make an infographic',
          href: '/blog/how-to-make-an-infographic',
        },
      ]}
    />
  );
}
