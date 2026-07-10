import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/ai-mind-map-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free AI Mind Map Maker & Creator | Generate Visuals Instantly',
  description:
    'Generate mind maps with AI from any topic or notes. Infogiph branches your ideas into a clear, editable mind map in seconds — free online mind map creator with PNG & SVG export, no design skills needed.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('AI Mind Map Maker')}&subtitle=${encodeURIComponent('Turn any topic into a branching mind map instantly.')}`,
});

export default function AiMindMapMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Free AI Mind Map Maker"
      title="Generate mind maps instantly with AI"
      subtitle="Give Infogiph a topic — or paste your messy notes — and the AI mind map creator organizes everything into a central idea with clean, colorful branches. Brainstorm faster, study smarter, plan clearer."
      ctaText="Create a mind map free"
      benefits={[
        {
          title: 'One topic in, full map out',
          body: 'Type "content marketing strategy" and watch the AI branch it into channels, formats, metrics, and next steps — a complete starting map in seconds.',
        },
        {
          title: 'Turns chaos into structure',
          body: 'Paste unordered notes, a transcript, or a brain dump. The AI groups related ideas into branches and sub-branches so the structure becomes obvious.',
        },
        {
          title: 'Radial layout, zero fiddling',
          body: 'Branches spread evenly around the central idea with readable spacing — no dragging nodes around to stop them overlapping.',
        },
        {
          title: 'Expand any branch with AI',
          body: "Stuck on one area? Ask the AI to expand a branch with more ideas. It's brainstorming with a partner who never runs out of suggestions.",
        },
        {
          title: 'Style it your way',
          body: 'Adjust colors, fonts, and node shapes on the canvas. Make it playful for a workshop or clean for a client deck.',
        },
        {
          title: 'Free, shareable exports',
          body: 'Download PNG or SVG free and drop your mind map into slides, docs, and posts. Paid plans add animated GIF/MP4 that draw the map branch by branch.',
        },
      ]}
      body={[
        {
          heading: 'What makes an AI mind map maker different?',
          paragraphs: [
            'Classic mind mapping software still asks you to create every node by hand — fine for capturing ideas you already have, slow for getting started. An AI mind map generator gives you a running start: it proposes the structure, the branches, and the first two levels of ideas from a single prompt.',
            'Infogiph works from any text input. A topic ("exam revision plan for organic chemistry"), a goal ("launch plan for our mobile app"), or raw notes from a meeting — the AI finds the central idea and organizes everything around it.',
          ],
        },
        {
          heading: 'How to make a mind map online in seconds',
          paragraphs: [
            'Describe your topic in the canvas chat, or paste the notes you want organized. The AI generates a mind map with a central node and branching subtopics. Review it, drag or reword anything, ask the AI to expand thin branches, then export.',
            'Mind maps in Infogiph are diagrams, not locked images — every node and connector stays editable, so your map can evolve as your thinking does.',
          ],
        },
        {
          heading: 'Mind maps for study, work, and planning',
          paragraphs: [
            'Students map subjects for revision — the radial structure mirrors how memory works, which is why mind maps are a classic study technique. Writers outline articles and books. Product teams break down features. Managers plan projects and meetings. Workshop facilitators capture group brainstorms live.',
            'If your ideas are more about relationships between concepts than branches from one center, try the concept map maker instead — Infogiph generates both from the same kind of text input.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is the AI mind map maker free?',
          a: 'Yes — generate mind maps with AI, edit them fully, and export PNG/SVG on the free plan. No credit card required to start.',
        },
        {
          q: 'How does the AI mind map generator work?',
          a: 'It reads your topic or notes, identifies the central idea, groups related points into branches, and lays the map out radially. You can then edit or extend any part.',
        },
        {
          q: 'Can I turn my notes into a mind map?',
          a: 'Yes — paste meeting notes, lecture notes, or any rough text and the AI organizes it into branches automatically.',
        },
        {
          q: 'Can the AI add more ideas to my map?',
          a: 'Yes. Ask it to expand any branch and it will suggest sub-ideas, which is especially useful for brainstorming past your first thoughts.',
        },
        {
          q: 'Mind map vs concept map — which should I use?',
          a: 'Mind maps radiate from one central idea and are best for brainstorming and memory. Concept maps connect many ideas with labeled relationships. Infogiph generates both.',
        },
        {
          q: 'What can I do with the finished mind map?',
          a: 'Export it as PNG or SVG for slides, docs, and social — or as an animated GIF/MP4 (paid) that reveals branches one by one for presentations.',
        },
      ]}
      related={[
        {
          label: 'How to make a mind map',
          href: '/blog/how-to-make-a-mind-map',
        },
        { label: 'AI Concept Map Maker', href: '/ai-concept-map-maker' },
        { label: 'AI Roadmap Maker', href: '/ai-roadmap-maker' },
        { label: 'Education templates', href: '/templates/education' },
      ]}
    />
  );
}
