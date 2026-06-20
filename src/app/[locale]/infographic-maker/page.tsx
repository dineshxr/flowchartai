import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/infographic-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Infographic Maker — Create Infographics Online Free | Infogiph',
  description:
    'Infogiph is an online infographic maker that turns plain text into polished, animated infographics in seconds. Create infographics free — no design skills, no fiddly templates. Export to PNG, SVG, GIF, and MP4.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('Infographic Maker')}&subtitle=${encodeURIComponent('Create infographics online from a single sentence.')}`,
});

export default function InfographicMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="AI Infographic Maker"
      title="The infographic maker that builds the design for you"
      subtitle="Create infographics online from a single sentence. Infogiph's AI infographic maker lays out the structure, matches icons, and animates the flow — so you ship a professional infographic in seconds, not hours."
      ctaText="Start making infographics free"
      benefits={[
        {
          title: 'Create infographics from text',
          body: 'Describe what you want in plain English and the infographic creator builds a complete, structured visual — no blank canvas, no design decisions to agonize over.',
        },
        {
          title: 'No design skills needed',
          body: 'Layout, spacing, color, and typography are handled automatically. If you can write a sentence, you can make an infographic that looks professionally designed.',
        },
        {
          title: 'Fully editable canvas',
          body: 'Every infographic stays editable. Move nodes, rename labels, swap icons, recolor, and re-run AI on any section until it is exactly right.',
        },
        {
          title: 'Make infographics online',
          body: 'Nothing to install. Infogiph runs in your browser, so you can create an infographic online from any device and pick up where you left off.',
        },
        {
          title: 'Animated by default',
          body: 'Connections and nodes animate to reveal flow and hierarchy — a level of polish static infographic makers cannot match.',
        },
        {
          title: 'Export anywhere',
          body: 'Download as PNG and SVG for decks and docs, or GIF and MP4 for social and video. Multiple aspect ratios for every channel.',
        },
      ]}
      body={[
        {
          heading: 'A faster way to create infographics online',
          paragraphs: [
            'Most infographic makers hand you a blank template and a drag-and-drop editor, then leave the hard part — structuring the information and making it look good — entirely up to you. Infogiph flips that around. You describe the idea, and the AI infographic maker produces a finished, on-brand visual you can refine instead of build from scratch.',
            'That means a marketing manager can turn a campaign brief into a shareable graphic, an engineer can document an architecture, and a teacher can visualize a process — all in the same tool, without opening a design app or hiring a designer.',
          ],
        },
        {
          heading: 'What you can make with the infographic creator',
          paragraphs: [
            'Infogiph specializes in structured, explanatory infographics: system architectures, process flows, data pipelines, org charts, comparison diagrams, and step-by-step sequences. Start from a prompt or pick a template — Chatbot, SaaS Platform, E-Commerce Flow, Data Pipeline, AI Agent System, or Org Chart — and remix it with AI.',
            'Because every element is editable, the same infographic can be resized and re-exported for a blog post, a pitch deck, a LinkedIn post, and an internal doc without starting over.',
          ],
        },
        {
          heading: 'Create infographics free, then scale up',
          paragraphs: [
            'You can start making infographics for free — no credit card required. The free plan includes a daily AI generation, full editing, and standard exports. Paid plans unlock hundreds of generations per month plus premium exports for teams that create infographics at volume.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is Infogiph a free infographic maker?',
          a: 'Yes. You can create infographics free with a daily AI generation, full editing, and standard exports. Paid plans add hundreds of generations per month and premium exports.',
        },
        {
          q: 'How do I create an infographic with Infogiph?',
          a: 'Type a sentence describing what you want to visualize, choose a template or let AI decide, then click create. Infogiph generates an editable, animated infographic in seconds.',
        },
        {
          q: 'Where can I make infographics online?',
          a: 'Right here. Infogiph is a browser-based infographic maker — there is nothing to install, and your projects are available from any device.',
        },
        {
          q: 'Do I need design experience to use this infographic creator?',
          a: 'No. Infogiph handles layout, color, spacing, and typography automatically, so non-designers can produce professional-looking infographics.',
        },
        {
          q: 'What formats can I export?',
          a: 'PNG and SVG for documents and presentations, plus GIF and MP4 for social and video — with multiple aspect ratios for each channel.',
        },
        {
          q: 'Can I edit the infographic after it is generated?',
          a: 'Absolutely. Every generated infographic is fully editable — move nodes, rename labels, swap icons, change colors, and re-run AI on any part.',
        },
      ]}
      related={[
        { label: 'Free Infographic Maker', href: '/free-infographic-maker' },
        { label: 'Infographic Video Maker', href: '/infographic-video-maker' },
        {
          label: 'How to make an infographic',
          href: '/blog/how-to-make-an-infographic',
        },
        {
          label: 'AI Infographic Generator',
          href: '/blog/infographics-generator-ai',
        },
      ]}
    />
  );
}
