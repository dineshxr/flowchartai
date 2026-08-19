import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/ai-timeline-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free Online Timeline Maker: Create AI Timeline Infographics',
  description:
    "Make timeline infographics online in seconds. List your events and dates — Infogiph's AI timeline maker designs a clean, editable timeline you can export as an animated GIF, an MP4, or a PNG. Free to start.",
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('AI Timeline Maker')}&subtitle=${encodeURIComponent('Turn events and dates into timeline infographics.')}`,
});

export default function AiTimelineMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Free Online Timeline Maker"
      title="Create timeline infographics with AI"
      subtitle="Company history, project plan, historical events, personal milestones — list them with dates and Infogiph's AI turns them into a designed timeline infographic. No rulers, no alignment fights, no design tool learning curve."
      ctaText="Make a timeline free"
      benefits={[
        {
          title: 'Events in, timeline out',
          body: '"2019 founded, 2021 first product, 2023 Series A, 2026 global launch" — the AI spaces, connects, and styles it into a timeline instantly.',
        },
        {
          title: 'Designed like an infographic',
          body: 'Milestone markers, icons, alternating labels, and color accents make your timeline presentation-ready — not a line with text stuck on it.',
        },
        {
          title: 'Perfect spacing automatically',
          body: 'The layout engine handles the hard part of timelines: keeping labels readable and evenly distributed no matter how many events you add.',
        },
        {
          title: 'Animated timelines',
          body: 'Export a GIF or MP4 — free plan included — where events appear in sequence, ideal for anniversary posts, product recaps, and history explainers.',
        },
        {
          title: 'Edit every event',
          body: 'Reword labels, add or remove milestones, change dates, restyle colors. The generated timeline is fully editable on the canvas.',
        },
        {
          title: 'From documents too',
          body: 'Paste an about-page, a project brief, or research notes — the AI extracts dated events and builds the chronology for you.',
        },
      ]}
      body={[
        {
          heading: 'What can you make with an AI timeline generator?',
          paragraphs: [
            'Timelines are one of the most versatile infographics: company milestone timelines for about pages and pitch decks, project timelines for kickoffs and status updates, historical timelines for classrooms and content, product release histories, case study "before and after" chronologies, and personal timelines for resumes, weddings, and anniversaries.',
            'The common pain is layout — spacing events, aligning labels, and re-flowing everything when one event changes. An AI timeline maker eliminates that: describe the events, and the design work happens automatically.',
          ],
        },
        {
          heading: 'How to make a timeline online in seconds',
          paragraphs: [
            'Write your events with rough dates in the canvas chat, or paste text that contains them. The AI generates a timeline infographic with markers, labels, and consistent styling. Edit whatever needs adjusting, then export — GIF, MP4, and PNG are all free.',
            'Timelines stay live on your account: when the next milestone lands, add it with one sentence and re-export, instead of digging out an old design file.',
          ],
        },
        {
          heading: 'Static or animated: choose how the story unfolds',
          paragraphs: [
            'A static timeline works for docs and print. But chronology is inherently sequential, and animation makes that visible — events appearing one after another turn a diagram into a story. Infogiph timelines animate natively, and every plan exports those animations as GIF or MP4 for social media, product updates, and presentations.',
            'If your "timeline" is really a forward-looking plan with phases and priorities, the AI roadmap maker is the better structure — and it works from the same plain-text input.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is the timeline maker free to use?',
          a: 'Yes — editing and unlimited GIF, MP4, and PNG exports are free, with 5 AI generations included. Paid plans remove the Infogiph watermark and add far more generations.',
        },
        {
          q: 'How do I create a timeline infographic with AI?',
          a: 'List your events and dates in plain text (or paste a document containing them). The AI generates a styled timeline you can edit and export.',
        },
        {
          q: 'How many events can a timeline have?',
          a: 'As many as remain readable — a dozen fits comfortably; for longer histories, group events into eras or split into multiple timelines.',
        },
        {
          q: 'Can I make a vertical timeline?',
          a: 'Yes — ask for a vertical layout in your prompt, or rearrange the generated timeline on the canvas. Vertical timelines work well for web pages and mobile.',
        },
        {
          q: 'Can I animate my timeline?',
          a: 'Yes. Timelines animate on the canvas, and every plan exports animated GIF/MP4 where milestones appear in sequence.',
        },
        {
          q: 'Where do people use these timelines?',
          a: 'About pages, pitch decks, project kickoffs, classroom materials, LinkedIn posts, anniversary and recap content — anywhere chronology tells the story.',
        },
      ]}
      related={[
        {
          label: 'How to make a timeline',
          href: '/blog/how-to-make-a-timeline',
        },
        { label: 'AI Roadmap Maker', href: '/ai-roadmap-maker' },
        {
          label: 'Infographic Video Maker',
          href: '/infographic-video-maker',
        },
        { label: 'Process templates', href: '/templates/process' },
      ]}
    />
  );
}
