import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/animated-infographic-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Animated Infographic Maker — Free AI Tool Online | Infogiph',
  description:
    'Free AI animated infographic maker: type a sentence, get a moving infographic. Export GIF or MP4, no video editor. Make animated infographics online in seconds.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('Animated Infographic Maker')}&subtitle=${encodeURIComponent('Turn text into moving infographics — export GIF & MP4.')}`,
});

export default function AnimatedInfographicMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="AI Animated Infographic Maker"
      title="Turn text into animated infographics"
      subtitle="Infogiph is a free online animated infographic maker powered by AI. Describe your idea in a sentence and get a moving infographic — steps reveal in order, arrows draw themselves, data comes alive. Export it as a GIF or MP4 and post it anywhere."
      ctaText="Make an animated infographic free"
      benefits={[
        {
          title: 'AI handles the animation',
          body: 'No keyframes, no timeline, no motion-design skills. The AI builds the diagram and choreographs the movement in one step — you just describe what to show.',
        },
        {
          title: 'Export as GIF or MP4',
          body: 'Download a seamless looping GIF for chat, email, and social feeds, or an MP4 for slides, ads, and video platforms. Motion is preserved in both.',
        },
        {
          title: 'Free to start',
          body: 'The free plan includes AI generations and real exports — GIF and MP4 included — so you can publish your first animated infographic without paying anything.',
        },
        {
          title: 'Works online, nothing to install',
          body: 'The animated infographic maker runs entirely in your browser. Start on your laptop, finish on another machine — no downloads, no plugins.',
        },
        {
          title: 'Start from 98 templates',
          body: 'Pick an animated template — process, timeline, comparison, org chart, and more — and let the AI rewrite it around your content.',
        },
        {
          title: 'Edit every detail',
          body: 'Change labels, icons, colors, layout, and pacing on an open canvas, then re-export instantly. The animation updates with your edits.',
        },
      ]}
      body={[
        {
          heading: 'Why animated infographics hold attention',
          paragraphs: [
            'A static infographic presents everything at once and leaves the viewer to work out where to look. An animated infographic controls the reveal: each step appears when it matters, movement points the eye at what changed, and sequence becomes something you watch instead of decode. That is why animated graphics consistently earn more attention in feeds that reward motion.',
            'The catch has always been production cost — hand-animating a diagram in a video editor takes hours. Infogiph removes that step entirely: the same AI that lays out your infographic also animates it.',
          ],
        },
        {
          heading: 'Make an animated infographic in three steps',
          paragraphs: [
            'First, describe what you want to visualize — a process, a launch plan, a system, a comparison. Second, the AI generates a complete animated infographic with labeled nodes, matched icons, and built-in motion. Third, edit anything you like and export as GIF, MP4, PNG, or SVG.',
            'Most animated infographics generate in seconds, so you can iterate on the wording and structure instead of wrestling with software.',
          ],
        },
        {
          heading: 'What to look for in the best animated infographic maker',
          paragraphs: [
            'The best animated infographic maker should generate motion automatically rather than hand you an empty timeline, export real GIF and MP4 files instead of trapping animations inside its own player, stay editable after generation, and let you try it free before paying.',
            'Infogiph checks all four: AI-generated animation, portable exports in every common format, a full open-canvas editor, and a free plan with no credit card required.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'What is an animated infographic maker?',
          a: 'It is a tool that creates infographics whose elements move — steps that appear in sequence, arrows that draw in, values that count up. Infogiph generates both the infographic and its animation automatically from a text description.',
        },
        {
          q: 'Is there a free animated infographic maker?',
          a: 'Yes. Infogiph is free to start: the free plan includes 5 AI generations and 5 exports, with GIF and MP4 included at 1080p (exports carry a small Infogiph watermark). No credit card required.',
        },
        {
          q: 'How does the AI animated infographic maker work?',
          a: 'You type a description of what you want to show. The AI turns it into a structured diagram, picks icons and layout, and adds motion — nodes reveal in order and connections animate. You can then edit anything and re-export.',
        },
        {
          q: 'Can I make animated infographics online without installing software?',
          a: 'Yes. Infogiph runs entirely in the browser, so you can make animated infographics online from any device — no downloads, plugins, or video editors.',
        },
        {
          q: 'What formats can I export?',
          a: 'Animated exports come out as looping GIF or MP4; static exports as PNG or SVG. The free plan exports at 1080p, and paid plans add 2K and 4K with no watermark.',
        },
        {
          q: 'Do I need motion design experience?',
          a: 'No. There is no timeline and there are no keyframes. If you can write a sentence describing your idea, the animated infographic maker handles the motion for you.',
        },
        {
          q: 'How can I create animated infographics without a complicated workflow?',
          a: 'Use a tool that generates the animation with the infographic instead of making you add motion afterwards. In Infogiph the whole workflow is: type what you want to show, let the AI build the animated diagram, tweak anything on the canvas, and export a GIF or MP4. No storyboard, no timeline, no separate animation software.',
        },
        {
          q: 'Can I start from a template instead of a blank canvas?',
          a: 'Yes — there are 98 editable templates across DevOps, marketing, finance, education, and more. Every template is pre-animated, so you can swap in your own labels and export a finished animated infographic in minutes.',
        },
      ]}
      related={[
        {
          label: 'Infographic Video Maker',
          href: '/infographic-video-maker',
        },
        {
          label: 'Free Infographic Video Maker',
          href: '/free-infographic-video-maker',
        },
        {
          label: 'Animated infographic examples',
          href: '/blog/animated-infographic-examples',
        },
        {
          label: 'How to make an animated infographic',
          href: '/blog/how-to-make-an-animated-infographic',
        },
        { label: 'AI Timeline Maker', href: '/ai-timeline-maker' },
        { label: 'AI Concept Map Maker', href: '/ai-concept-map-maker' },
      ]}
    />
  );
}
