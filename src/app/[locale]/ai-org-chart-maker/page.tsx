import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/ai-org-chart-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free Organizational Chart Maker | Create AI Org Charts in Seconds',
  description:
    'Build organizational charts in seconds with AI. Paste your team structure — names, roles, who reports to whom — and Infogiph draws a clean, editable org chart. Free online org chart maker with GIF, MP4 & PNG export.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('AI Org Chart Maker')}&subtitle=${encodeURIComponent('From team list to org chart in seconds.')}`,
});

export default function AiOrgChartMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Free Organizational Chart Maker"
      title="Create org charts in seconds with AI"
      subtitle="Type your team structure the way you'd explain it — 'Priya is CEO; Marcus leads Engineering with two teams under him; Dana runs Sales…' — and Infogiph's AI org chart generator draws the hierarchy, boxes, and reporting lines for you."
      ctaText="Make an org chart free"
      benefits={[
        {
          title: 'From team list to chart in seconds',
          body: 'No dragging one box per person. Paste names, titles, and reporting lines as plain text and the AI assembles the whole hierarchy at once.',
        },
        {
          title: 'Reporting lines drawn correctly',
          body: 'The AI understands "reports to", "leads", and "under" — managers sit above their teams with connectors placed and aligned automatically.',
        },
        {
          title: 'Reorgs without redrawing',
          body: 'Team moved under a new VP? Say so in one sentence and the chart restructures. Keeping the org chart current stops being a chore.',
        },
        {
          title: 'Clean enough for the board deck',
          body: 'Balanced layout, consistent boxes, and subtle color grouping by department — a chart you can put in front of leadership without touch-ups.',
        },
        {
          title: 'Departments and dotted lines',
          body: 'Group by function, color-code teams, and add dotted-line or cross-functional relationships on the canvas after generation.',
        },
        {
          title: 'Free export, easy sharing',
          body: 'Download PNG, GIF, or MP4 free for onboarding docs, wikis, and slides. Animated exports can introduce the team one level at a time.',
        },
      ]}
      body={[
        {
          heading: 'Why an AI organizational chart maker beats templates',
          paragraphs: [
            "Org chart templates give you someone else's structure — you still delete, duplicate, and rewire boxes until it matches your company, then repeat the surgery at every reorg. An AI org chart generator starts from your actual structure instead: you describe the organization, and the chart is born already correct.",
            'Infogiph parses names, roles, and reporting relationships from plain text — even a rough list works. The layout engine handles hierarchy depth, sibling spacing, and connector routing, which are exactly the parts that make hand-drawn org charts crooked.',
          ],
        },
        {
          heading: 'How to make an organizational chart in three steps',
          paragraphs: [
            'One: write the structure. A simple format works — "CEO: Priya. CTO: Marcus (reports to Priya). Engineering Manager: Lena (reports to Marcus)…" — or paste a team page or HR export. Two: generate, and the AI builds the tree with everyone in place. Three: polish and export — adjust colors by department, add photos or notes, download a PNG, GIF, or MP4 free.',
            'The chart stays editable in your account, so the next new hire is a ten-second update rather than a new document.',
          ],
        },
        {
          heading: 'Org charts for companies, teams, and projects',
          paragraphs: [
            'Startups map the whole company for investors and onboarding. HR teams keep official charts current through growth and reorgs. Project managers chart project teams and RACI-style responsibilities. Agencies show clients exactly who does what. Teachers and students diagram organizational structures for coursework.',
            'Related structures are one prompt away too: family trees and genograms use the same hierarchy engine, and flow charts cover processes rather than people.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is the org chart maker free?',
          a: 'Yes — full editing and unlimited GIF, MP4, and PNG exports are included free, along with 5 AI generations. No credit card required.',
        },
        {
          q: 'How do I create an org chart with AI?',
          a: 'Describe your organization in plain text — names, roles, and who reports to whom — and the AI generates the chart. Edit on the canvas and export.',
        },
        {
          q: 'How large an organization can it handle?',
          a: 'Dozens of people render comfortably on one chart. For bigger orgs, generate per-department charts and link them — usually clearer for readers anyway.',
        },
        {
          q: 'Can I update the chart when the team changes?',
          a: 'Yes — tell the AI what changed ("move Design under Product") or edit boxes directly. No redrawing from scratch.',
        },
        {
          q: 'Can I color-code departments?',
          a: 'Yes. The generator applies sensible grouping, and you can restyle any box, group, or connector on the canvas.',
        },
        {
          q: 'Can I export the org chart to PowerPoint or a wiki?',
          a: 'Export a PNG and embed it in PowerPoint, Google Slides, Notion, Confluence, or any doc — or use an animated GIF wherever the tool supports it.',
        },
      ]}
      related={[
        {
          label: 'How to make an org chart',
          href: '/blog/how-to-make-an-org-chart',
        },
        { label: 'AI Genogram Maker', href: '/ai-genogram-maker' },
        { label: 'AI Flow Chart Maker', href: '/ai-flow-chart-maker' },
        { label: 'People & org templates', href: '/templates/org-people' },
      ]}
    />
  );
}
