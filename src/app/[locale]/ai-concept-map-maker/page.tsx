import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/ai-concept-map-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free AI Concept Map Maker & Generator: Visualize Ideas Instantly',
  description:
    'Turn notes, topics, and ideas into clear concept maps with AI. Infogiph connects concepts with labeled relationships automatically — free online concept map generator, fully editable, exports to GIF, MP4 & PNG.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('AI Concept Map Maker')}&subtitle=${encodeURIComponent('Visualize ideas and their relationships instantly.')}`,
});

export default function AiConceptMapMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Free AI Concept Map Maker"
      title="Visualize ideas instantly with an AI concept map generator"
      subtitle="Concept maps show how ideas connect — but drawing all those nodes and linking phrases by hand is slow. Describe your topic and Infogiph's AI builds the map for you: concepts, connections, and labels, ready to edit and export free."
      ctaText="Generate a concept map free"
      benefits={[
        {
          title: 'Ideas to map, instantly',
          body: 'Paste lecture notes, a chapter summary, or a rough brain dump. The AI identifies the key concepts and draws the relationships between them in seconds.',
        },
        {
          title: 'Labeled connections, not just lines',
          body: 'Good concept maps explain how ideas relate — "causes", "requires", "is part of". Infogiph generates linking labels so the map actually teaches.',
        },
        {
          title: 'Auto-layout that stays readable',
          body: 'No overlapping nodes or spaghetti arrows. The AI arranges concepts hierarchically from the big idea down to the details.',
        },
        {
          title: 'Edit and extend freely',
          body: 'Add missing concepts, reword nodes, redraw connections, or ask the AI to expand a branch. The canvas gives you full manual control.',
        },
        {
          title: 'Free GIF, MP4 & PNG export',
          body: 'Drop finished concept maps into study notes, slides, wikis, and papers. Unlimited exports on the free plan — paid plans simply drop the Infogiph watermark.',
        },
        {
          title: 'Great for studying and teaching',
          body: 'Students map chapters for exams, teachers build maps for lessons, and teams map domain knowledge for onboarding — all from plain text.',
        },
      ]}
      body={[
        {
          heading: 'What is a concept map — and why generate one with AI?',
          paragraphs: [
            'A concept map is a diagram that shows concepts as nodes and the relationships between them as labeled arrows. Unlike a mind map, which radiates from one center, a concept map is about the network of relationships: cause and effect, hierarchy, dependency, similarity.',
            'That structure is exactly what makes concept maps tedious to draw manually — every relationship needs a line and a label. An AI concept map generator removes that friction. Infogiph reads your text, extracts the concepts, infers the relationships, and lays out the whole network for you. You review and refine instead of drawing from scratch.',
          ],
        },
        {
          heading: 'How to make a concept map online with Infogiph',
          paragraphs: [
            'Start by describing the topic or pasting your source text — anything from "photosynthesis for a biology class" to product documentation. The AI generates a concept map with the main idea at the top and supporting concepts branching below, each connection labeled. Then edit: rename nodes, add cross-links between branches, adjust colors, and export.',
            'Because it runs in the browser, there is nothing to install and your maps are saved to your account. You can return, extend a map as your understanding grows, and re-export anytime.',
          ],
        },
        {
          heading: 'Concept maps vs mind maps vs flowcharts',
          paragraphs: [
            'Use a concept map when relationships between ideas are the point — studying a subject, mapping a domain, or explaining how a system of ideas fits together. Use a mind map for free-form brainstorming around a single center. Use a flowchart when there is a sequence or decision path.',
            "Infogiph generates all three from text, so you're never locked into the wrong format — if your concept map turns out to be a process, regenerate it as a flowchart with one prompt.",
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is the AI concept map maker free to use?',
          a: 'Yes. You can generate concept maps with AI, edit them on the full canvas, and take unlimited GIF, MP4, and PNG exports on the free plan — no credit card required.',
        },
        {
          q: 'How does the AI build a concept map from my text?',
          a: 'It identifies the key concepts in your input, infers how they relate, and draws a hierarchical map with labeled connections. You can then edit any node, link, or label.',
        },
        {
          q: "What's the difference between a concept map and a mind map?",
          a: 'A mind map radiates ideas from one central node. A concept map is a network: multiple concepts connected by labeled relationships like "causes" or "is part of". Infogiph makes both.',
        },
        {
          q: 'Can I use it for studying?',
          a: 'Absolutely — paste lecture notes or a textbook summary and get a revision-ready map. Concept mapping is one of the best-evidenced study techniques for retention.',
        },
        {
          q: 'Can I add cross-links between branches?',
          a: 'Yes. After generation you can draw connections between any two concepts and label them, which is what makes concept maps more expressive than simple trees.',
        },
        {
          q: 'What export formats are supported?',
          a: 'Three: animated GIF, MP4 video, and static PNG — all included on every plan, free ones too. Paid plans remove the small Infogiph watermark, which matters for teaching videos and explainers.',
        },
      ]}
      related={[
        {
          label: 'How to make a concept map',
          href: '/blog/how-to-make-a-concept-map',
        },
        { label: 'AI Mind Map Maker', href: '/ai-mind-map-maker' },
        { label: 'AI Flow Chart Maker', href: '/ai-flow-chart-maker' },
        { label: 'Education templates', href: '/templates/education' },
      ]}
    />
  );
}
