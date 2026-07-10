import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/ai-roadmap-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free AI Roadmap Maker & Generator | Create Visual Roadmaps Online',
  description:
    'Create product, project, and learning roadmaps online with AI. Describe your milestones and Infogiph generates a polished visual roadmap in seconds — free to start, editable, exports to PNG, SVG, GIF & MP4.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('AI Roadmap Maker')}&subtitle=${encodeURIComponent('Visual roadmaps from plain text — in seconds.')}`,
});

export default function AiRoadmapMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Free AI Roadmap Maker"
      title="Create visual roadmaps online with AI"
      subtitle="Turn a list of goals into a roadmap people actually follow. Describe your phases, milestones, and timeframes — Infogiph's AI roadmap generator lays them out as a clean visual you can present, share, and update."
      ctaText="Generate a roadmap free"
      benefits={[
        {
          title: 'Milestones to roadmap in seconds',
          body: '"Q1: beta launch, Q2: mobile app, Q3: integrations, Q4: enterprise" — one line like that becomes a designed, presentation-ready roadmap.',
        },
        {
          title: 'Any roadmap style',
          body: 'Quarter-by-quarter product roadmaps, phase-based project plans, Now/Next/Later boards, or step-by-step learning paths — describe the structure you want.',
        },
        {
          title: 'Looks like a designer made it',
          body: 'Clear phases, consistent spacing, icons, and color accents — not a Gantt-chart screenshot or a bulleted slide.',
        },
        {
          title: 'Update it in one sentence',
          body: 'Plans change. Tell the AI "move integrations to Q4 and add SSO to Q3" and the roadmap re-flows without manual redrawing.',
        },
        {
          title: 'Present it anywhere',
          body: 'Export free PNG/SVG for decks, docs, and wikis — or animated GIF/MP4 (paid) that reveals the roadmap phase by phase in all-hands and investor updates.',
        },
        {
          title: 'From notes to narrative',
          body: 'Paste a strategy doc or planning notes and the AI extracts the milestones and sequence for you — the roadmap is already in your text.',
        },
      ]}
      body={[
        {
          heading: 'What is an AI roadmap generator?',
          paragraphs: [
            'A roadmap maker turns plans into a visual sequence — phases, milestones, and deliverables laid out over time. The AI version means you never start from a blank canvas: you describe the plan in words, and the generator produces the visual structure, labels, and styling automatically.',
            "Infogiph reads your description, identifies the phases and milestones, and arranges them into a roadmap diagram you can edit like any canvas drawing. It's built for the roadmaps you show people — kickoffs, all-hands, investor decks, course outlines — where clarity and polish matter.",
          ],
        },
        {
          heading: 'How to make a roadmap in three steps',
          paragraphs: [
            'First, write down the plan: the phases or quarters, and what happens in each. Second, generate — the AI builds the roadmap with your milestones in order, grouped and labeled. Third, refine and export: adjust wording, colors, and emphasis, then download PNG or SVG free.',
            "If your plan lives in a doc already, paste it. Infogiph's text-to-visual AI pulls the roadmap out of prose, which is dramatically faster than rebuilding it shape by shape in a slide editor.",
          ],
        },
        {
          heading: 'Roadmaps teams actually make with Infogiph',
          paragraphs: [
            'Product managers make quarterly feature roadmaps and Now/Next/Later views for stakeholders. Founders put 12-month roadmaps in pitch decks. Engineering leads map migration and rollout phases. Marketers plan campaign calendars. Educators and self-learners build learning roadmaps — "become a data analyst in 6 months" — with stages and skills.',
            'A roadmap is a timeline with intent. If you need pure chronology — history, project milestones after the fact — the AI timeline maker may fit better; both are one prompt away.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is the AI roadmap maker free?',
          a: 'Yes. Free plan includes AI roadmap generation, full editing, and PNG/SVG export — no credit card. Paid plans add volume and animated GIF/MP4 exports.',
        },
        {
          q: 'What kinds of roadmaps can I create?',
          a: 'Product roadmaps, project roadmaps, technology/migration roadmaps, marketing plans, startup roadmaps for pitch decks, and personal learning roadmaps.',
        },
        {
          q: 'Can I make a quarterly (Q1–Q4) roadmap?',
          a: 'Yes — mention the quarters in your prompt and the AI groups milestones under each. Month-based and phase-based groupings work the same way.',
        },
        {
          q: 'Can I change the roadmap after generating it?',
          a: 'Yes — edit any element on the canvas or ask the AI to move, add, or remove milestones. The layout re-flows automatically.',
        },
        {
          q: 'Can I use these roadmaps in investor or client decks?',
          a: 'Absolutely. Export SVG for crisp scaling in slides, or an animated MP4 (paid) that reveals phases as you talk through them.',
        },
        {
          q: 'Roadmap vs timeline — which do I need?',
          a: 'Roadmaps communicate a plan (phases, priorities, direction); timelines communicate chronology (events in time order). Infogiph generates both from text.',
        },
      ]}
      related={[
        {
          label: 'How to make a roadmap',
          href: '/blog/how-to-make-a-roadmap',
        },
        { label: 'AI Timeline Maker', href: '/ai-timeline-maker' },
        { label: 'AI Flow Chart Maker', href: '/ai-flow-chart-maker' },
        { label: 'Product templates', href: '/templates/product' },
      ]}
    />
  );
}
