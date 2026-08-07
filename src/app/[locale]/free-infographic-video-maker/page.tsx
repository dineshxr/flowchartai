import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/free-infographic-video-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free Infographic Video Maker — Animated GIF & MP4 | Infogiph',
  description:
    'Make infographic videos free. Infogiph turns text into animated video infographics you can export as GIF or MP4 at no cost — no credit card, no video editor.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('Free Infographic Video Maker')}&subtitle=${encodeURIComponent('Animated video infographics — export GIF & MP4 free.')}`,
});

export default function FreeInfographicVideoMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="AI Infographic Video Generator"
      title="The free infographic video maker for GIF & MP4"
      subtitle="Infogiph is an infographic video maker that is free to use: describe your idea in a sentence, AI turns it into an animated video infographic, and you export a real GIF or MP4 — no credit card, no video editor, no rendering queue."
      ctaText="Create a free infographic video"
      benefits={[
        {
          title: 'GIF & MP4 export on the free plan',
          body: 'Free means a real video file on your device — looping GIF or MP4 at 1080p — not a locked preview behind a checkout page.',
        },
        {
          title: 'Text to video in seconds',
          body: 'Describe a process, launch, or system and the AI generates an animated diagram with motion built in. No storyboarding, no keyframes.',
        },
        {
          title: 'No timeline, no learning curve',
          body: 'Skip After Effects, Premiere, and drag-and-drop video editors. The animation is generated for you and stays editable as a diagram.',
        },
        {
          title: 'Sized for every platform',
          body: 'Export square 1:1, vertical 9:16, or widescreen 16:9 so your free infographic video fits Instagram, TikTok, LinkedIn, X, and YouTube without cropping.',
        },
        {
          title: 'Edit and re-export freely',
          body: 'Tweak labels, icons, colors, and pacing on the canvas, then export again. Iterating on a video infographic costs nothing extra.',
        },
        {
          title: 'Upgrade only for more',
          body: 'Paid plans add unlimited exports, watermark removal, and 2K/4K video. Everyday one-off videos stay free.',
        },
      ]}
      body={[
        {
          heading: 'What the free plan actually includes',
          paragraphs: [
            'Many "free" infographic video makers let you build something, then hold the download hostage. Infogiph keeps the free tier genuinely usable: 5 AI generations, 5 exports, the full editor, and every export format — GIF, MP4, PNG, and SVG — at 1080p with a small Infogiph watermark.',
            'If you outgrow it, Pro adds unlimited exports, watermark-free files, 2K and 4K resolution, and hundreds of monthly AI generations. But you can make and publish your first infographic videos without spending anything.',
          ],
        },
        {
          heading: 'A free video maker without the video editor',
          paragraphs: [
            'Traditional tools make you design a static graphic, import it into an editor, and animate every element by hand. Free trials of those tools usually expire before you have learned the timeline.',
            'Infogiph works differently: it is an AI infographic video maker, so the animation is generated with the diagram. Steps reveal in order, connectors draw toward their targets, and the result exports as video — with nothing to keyframe and nothing to render locally.',
          ],
        },
        {
          heading: 'Where free infographic videos work best',
          paragraphs: [
            'Looping GIFs are perfect for chat, docs, email, and social posts where autoplay video is unreliable. MP4s shine in slide decks, paid ads, YouTube explainers, and anywhere you want crisp playback. Because Infogiph exports both from the same project, one free infographic video covers every channel you publish on.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is Infogiph really a free infographic video maker?',
          a: 'Yes. The free plan includes 5 AI generations and 5 exports with GIF and MP4 included, at 1080p. No credit card is required to start.',
        },
        {
          q: 'Can I export MP4 for free?',
          a: 'Yes — MP4 and looping GIF are both available on the free plan at 1080p. Paid plans add 2K and 4K exports.',
        },
        {
          q: 'Do free infographic videos have a watermark?',
          a: 'Free exports carry a small Infogiph watermark. Upgrading to Pro removes the watermark and unlocks unlimited exports.',
        },
        {
          q: 'How many infographic videos can I make for free?',
          a: 'The free plan includes 5 AI generations and 5 exports. The editor and all 98 templates stay fully available, so you can refine a project as much as you like before spending an export.',
        },
        {
          q: 'Do I need After Effects or Premiere?',
          a: 'No. The animation is generated automatically from your text and edited as a diagram, not on a video timeline. Export handles the rendering.',
        },
        {
          q: 'What do the paid plans add?',
          a: 'Pro ($12/mo, or $9/mo billed yearly) adds 500 AI generations per month, unlimited exports, no watermark, and 2K/4K video. Max removes the caps entirely and adds brand kit and team features.',
        },
        {
          q: 'What is the best free infographic video maker?',
          a: 'The best free option is the one that gives you a real video file without payment. Judge any tool on four things: does the free tier export actual GIF/MP4 (not a locked preview), does it animate the infographic for you, can you edit after generating, and is the resolution usable. Infogiph checks all four — free exports are real 1080p GIF/MP4 files.',
        },
        {
          q: 'How do I turn an infographic into a video?',
          a: 'With Infogiph you skip the conversion step entirely: describe your content (or pick a template), the AI generates the infographic with motion built in, and you export straight to MP4 or looping GIF. There is no separate animation or rendering stage.',
        },
        {
          q: 'Can AI generate an infographic video from text?',
          a: 'Yes — that is exactly how Infogiph works. Paste or type your text, and the AI infographic video generator builds a structured animated diagram from it: steps reveal in sequence, connectors draw in, and the result exports as video.',
        },
      ]}
      related={[
        {
          label: 'Infographic Video Maker',
          href: '/infographic-video-maker',
        },
        {
          label: 'Animated Infographic Maker',
          href: '/animated-infographic-maker',
        },
        { label: 'Free Infographic Maker', href: '/free-infographic-maker' },
        {
          label: 'How to make an infographic video',
          href: '/blog/how-to-make-an-infographic-video',
        },
      ]}
    />
  );
}
