import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/ai-flow-chart-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free AI Flow Chart Maker Online - Create Diagrams Instantly',
  description:
    'Make flow charts online with AI. Describe a process in plain English and Infogiph generates a clean, editable flow chart in seconds — free to start, no drawing required, export to GIF, MP4 & PNG.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('AI Flow Chart Maker')}&subtitle=${encodeURIComponent('Create flow charts online instantly — from plain text.')}`,
});

export default function AiFlowChartMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Free AI Flow Chart Maker Online"
      title="Create flow charts instantly with AI"
      subtitle="Skip the shape palette. Describe your process — onboarding, approvals, algorithms, troubleshooting — and Infogiph's AI flow chart maker draws the boxes, decisions, and arrows for you. Edit anything, export free."
      ctaText="Make a flow chart free"
      benefits={[
        {
          title: 'Plain English in, flow chart out',
          body: '"User signs up, we verify their email, if verification fails send a reminder…" — that\'s all the input the AI needs to draw a correct, connected flow chart.',
        },
        {
          title: 'Decisions, branches, and loops handled',
          body: 'The AI uses proper flowchart conventions — diamonds for decisions, labeled yes/no branches, loops back to earlier steps — without you memorizing symbol rules.',
        },
        {
          title: 'Always-clean auto layout',
          body: 'No crossed arrows or misaligned boxes. Generated flow charts come evenly spaced and easy to follow, even for complex processes.',
        },
        {
          title: 'Refine by chatting',
          body: 'Ask for changes in plain language: "add an error-handling branch after payment" or "split step 3 into two steps". The chart updates in place.',
        },
        {
          title: 'Full manual editing too',
          body: 'The generated chart lands on an Excalidraw-style canvas — drag nodes, reword labels, restyle colors, and add anything the AI missed.',
        },
        {
          title: 'Animated or static exports',
          body: 'Export a static PNG or an animated GIF or MP4 free — flow charts that reveal step by step, perfect for tutorials and demos. Upgrading only removes the watermark.',
        },
      ]}
      body={[
        {
          heading: 'Why use an AI flow chart maker instead of drawing?',
          paragraphs: [
            'Traditional flow chart tools make you do everything: drag each shape, connect each arrow, align each row, and re-flow the whole diagram every time the process changes. For a 20-step process, that is an afternoon of work.',
            'An AI flow chart maker inverts the workflow. You write (or paste) the process description — the thing you already know — and the AI handles notation, layout, and connections. Infogiph generates flow charts in seconds and keeps them editable, so process changes are a one-sentence request instead of a redraw.',
          ],
        },
        {
          heading: 'How to create a flow chart online in three steps',
          paragraphs: [
            'One: open the canvas and describe your process in the chat — a sentence works, and pasting a full SOP or spec works even better. Two: the AI generates the flow chart with start/end points, process steps, and decision branches. Three: edit anything on the canvas and export as a PNG, GIF, or MP4 for free.',
            'Everything runs in the browser. There is nothing to download, and your flow charts are saved to your account so you can update them as processes evolve.',
          ],
        },
        {
          heading: 'What people make with the AI flow chart generator',
          paragraphs: [
            'Engineers diagram algorithms, data pipelines, and system logic. Operations teams document SOPs and approval workflows. Support teams build troubleshooting trees. Teachers turn textbook processes into visuals, and students map assignments like do-while loops or decision logic.',
            'If you need ideas or conventions, our guides on flowchart symbols and flow chart examples cover the standard notation — but with AI generation, you rarely need to memorize any of it.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is the AI flow chart maker free?',
          a: 'Yes — free to start with 5 AI generations, full canvas editing, and unlimited GIF, MP4, and PNG exports. No credit card needed. Paid plans remove the watermark and add generation volume.',
        },
        {
          q: 'How do I make a flow chart with AI?',
          a: 'Describe the process in plain language (or paste an existing doc), and the AI generates the complete flow chart. Then edit on the canvas and export.',
        },
        {
          q: 'Does it use standard flowchart symbols?',
          a: 'Yes — ovals for start/end, rectangles for steps, diamonds for decisions with labeled branches. You can restyle any element after generation.',
        },
        {
          q: 'Can it handle complex processes with branches and loops?',
          a: 'Yes. The AI handles conditional branches, parallel paths, and loops back to earlier steps. For very large processes, you can generate sections and connect them.',
        },
        {
          q: 'Can I edit the flow chart after it generates?',
          a: 'Fully. Move nodes, reword labels, add shapes, change colors — or ask the AI to revise specific parts. It behaves like a normal diagram editor after generation.',
        },
        {
          q: 'Can I export my flow chart to PowerPoint or docs?',
          a: 'Export a PNG and drop it into PowerPoint, Google Docs, Notion, or anywhere images work. Animated GIF/MP4 exports, free as well, embed nicely in slides and wikis too.',
        },
      ]}
      related={[
        { label: 'Flow chart examples', href: '/blog/flow-chart-examples' },
        {
          label: 'Decision tree examples',
          href: '/blog/decision-tree-examples',
        },
        {
          label: 'Workflow diagram guide',
          href: '/blog/workflow-diagram-guide',
        },
        {
          label: 'Flowchart symbols guide',
          href: '/blog/flowchart-symbols-guide',
        },
        {
          label: 'Flowchart maker guide',
          href: '/blog/flowchart-maker-guide',
        },
        { label: 'AI Roadmap Maker', href: '/ai-roadmap-maker' },
        { label: 'AI Concept Map Maker', href: '/ai-concept-map-maker' },
        {
          label: 'AI Agent Architecture Diagram',
          href: '/templates/ai-ml/ai-agent-architecture-diagram',
        },
        { label: 'Process templates', href: '/templates/process' },
      ]}
    />
  );
}
