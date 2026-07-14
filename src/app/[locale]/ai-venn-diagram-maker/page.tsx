import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/ai-venn-diagram-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free Venn Diagram Maker: Create AI Venn Diagrams Online',
  description:
    "Create Venn diagrams online with AI. Name the sets you're comparing and Infogiph generates a clean 2- or 3-circle Venn diagram with the overlaps filled in — free, editable, exports to PNG & SVG.",
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('AI Venn Diagram Maker')}&subtitle=${encodeURIComponent('Overlaps and differences, visualized in seconds.')}`,
});

export default function AiVennDiagramMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Free Venn Diagram Maker"
      title="Create Venn diagrams online with AI"
      subtitle="Comparing two ideas, three tools, or overlapping audiences? Describe them and Infogiph's AI Venn diagram generator draws the circles and — the hard part — fills in what belongs in each overlap."
      ctaText="Make a Venn diagram free"
      benefits={[
        {
          title: 'The AI fills the overlaps',
          body: 'Drawing circles is easy; deciding what goes in the intersection is the work. Describe your sets and the AI proposes the shared and unique traits for each region.',
        },
        {
          title: '2-circle and 3-circle Venns',
          body: 'Classic two-set comparisons or three-set diagrams with a center intersection — say which you need in the prompt and it generates accordingly.',
        },
        {
          title: 'Readable labels, balanced circles',
          body: 'Text fits inside regions, overlaps stay legible, and the diagram looks intentional — no squeezing captions into slivers by hand.',
        },
        {
          title: 'Restyle in clicks',
          body: 'Change circle colors, opacity, fonts, and labels on the canvas. Match your brand or your slide theme in seconds.',
        },
        {
          title: 'Free PNG & SVG export',
          body: 'Use your Venn diagram in essays, decks, blog posts, and social. SVG export keeps it crisp at any size.',
        },
        {
          title: 'More than circles when you need it',
          body: 'If your comparison outgrows a Venn — many criteria, many options — switch to a comparison chart with one prompt.',
        },
      ]}
      body={[
        {
          heading: 'What is a Venn diagram maker with AI?',
          paragraphs: [
            'A Venn diagram shows sets as overlapping circles: what is unique to each sits in the outer regions, what is shared sits in the overlap. It is the fastest visual for "how are these alike and different?" — which is why it appears everywhere from grade-school essays to product strategy decks.',
            'An AI Venn diagram generator does more than draw shapes. Infogiph reads your description — "compare remote work and office work" — and generates the diagram with the regions already populated: unique traits in each circle, common ground in the middle. You edit the content rather than inventing it onto a blank template.',
          ],
        },
        {
          heading: 'How to make a Venn diagram in seconds',
          paragraphs: [
            'Describe the comparison in the canvas chat: name the two or three sets and, optionally, any points you already know belong in each region. The AI generates the diagram; you refine labels, adjust colors, and export PNG or SVG free.',
            'Because everything is editable, you can also use a generated Venn as a workshop artifact — drop it on the canvas, then move items between regions live as the team debates where they belong.',
          ],
        },
        {
          heading: 'Classic Venn diagram use cases',
          paragraphs: [
            'Students compare characters, historical events, and theories in essays and projects. Teachers make compare-and-contrast worksheets. Marketers map audience overlaps and brand positioning ("us vs them, and the sweet spot"). Product teams visualize feature overlap with competitors. Job seekers even use the three-circle version for ikigai-style career reflection.',
            'When the overlap itself is the message — a niche, a positioning, a shared responsibility — a Venn diagram beats a table every time.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is the Venn diagram maker free?',
          a: 'Yes — generate Venn diagrams with AI, edit them fully, and export PNG/SVG on the free plan. No credit card required.',
        },
        {
          q: 'Can it make 3-circle Venn diagrams?',
          a: 'Yes — ask for three sets and the AI generates a three-circle Venn with all seven regions considered, including the center intersection.',
        },
        {
          q: 'Does the AI suggest what goes in the overlap?',
          a: 'Yes. From your description of the sets, it proposes unique and shared characteristics for each region — you can edit or replace any of them.',
        },
        {
          q: 'Can I change colors and labels?',
          a: 'Everything is editable on the canvas: circle colors and opacity, region labels, title, and fonts.',
        },
        {
          q: 'Can I use the diagrams in school or work documents?',
          a: 'Yes — export clean PNG for docs and slides, or SVG for print and scaling. Free-plan exports carry no watermark.',
        },
        {
          q: 'When should I use a comparison chart instead of a Venn?',
          a: 'Use a Venn for overlap between 2–3 sets. When you are scoring many options across many criteria, a side-by-side comparison chart is clearer — Infogiph makes both.',
        },
      ]}
      related={[
        {
          label: 'How to make a Venn diagram',
          href: '/blog/how-to-make-a-venn-diagram',
        },
        {
          label: 'AI Comparison Chart Maker',
          href: '/ai-comparison-chart-maker',
        },
        { label: 'AI Concept Map Maker', href: '/ai-concept-map-maker' },
        { label: 'Data templates', href: '/templates/data' },
      ]}
    />
  );
}
