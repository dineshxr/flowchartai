import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/infographic-video-maker';

export const metadata: Metadata = constructMetadata({
  title:
    'Infographic Video Maker — Create Animated Video Infographics | Infogiph',
  description:
    "Turn text into animated video infographics. Infogiph's infographic video maker generates motion diagrams you can export as GIF or MP4 — perfect for social, ads, and presentations. Free to start.",
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('Infographic Video Maker')}&subtitle=${encodeURIComponent('Create animated video infographics — export GIF & MP4.')}`,
});

export default function InfographicVideoMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Animated Infographic Video Maker"
      title="Make animated infographic videos from text"
      subtitle="Infogiph is an infographic video maker that turns a sentence into a moving, animated visual. Generate a video infographic in seconds and export it as a GIF or MP4 — ready for social, ads, and presentations."
      ctaText="Create a video infographic free"
      benefits={[
        {
          title: 'Text to video infographic',
          body: 'Describe a process or system and Infogiph animates it — nodes appear, connections draw in, and flow is revealed through motion automatically.',
        },
        {
          title: 'Export GIF and MP4',
          body: 'Download your infographic video as a looping GIF for chat and social or an MP4 for slides, ads, and YouTube — animation preserved.',
        },
        {
          title: 'Built for social',
          body: 'Pick 1:1, 9:16, or 16:9 aspect ratios so your video infographic fits Instagram, TikTok, Reels, LinkedIn, and X without cropping.',
        },
        {
          title: 'No video editor required',
          body: 'Skip After Effects and timelines. Making infographics videos here means writing a sentence and clicking export — the motion is handled for you.',
        },
        {
          title: 'Edit then re-render',
          body: 'Adjust nodes, labels, icons, colors, and pacing, then re-export the video infographic instantly. No re-rendering pipeline to manage.',
        },
        {
          title: 'On-brand and polished',
          body: 'Clean typography, matched icons, and smooth easing give every infographic video a designed, professional feel.',
        },
      ]}
      body={[
        {
          heading: 'Why animated infographics outperform static ones',
          paragraphs: [
            'A static infographic asks the viewer to figure out the order of things on their own. A video infographic shows it: steps reveal in sequence, arrows draw toward their targets, and the eye follows the flow. That motion makes complex systems easier to understand and far more shareable on social feeds that favor video.',
            'Infogiph builds that animation in automatically. You do not storyboard or keyframe anything — the infographic video maker animates the structure it generates from your text.',
          ],
        },
        {
          heading: 'From idea to infographic video in seconds',
          paragraphs: [
            'Describe what you want to show — "user onboarding flow from signup to activation," for example. Infogiph generates an animated diagram with labeled nodes and connections. Preview the motion, fine-tune anything, then export.',
            'Choose GIF for lightweight loops in chat, docs, and social posts, or MP4 for crisp playback in presentations, ads, and video platforms. Both keep the animation intact.',
          ],
        },
        {
          heading: 'Making infographics videos for every channel',
          paragraphs: [
            'Marketers use animated infographics for launch posts and paid ads. Product and engineering teams turn architecture into motion for demos and docs. Educators and creators explain processes that are hard to capture in a still image. With multiple aspect ratios, one infographic video can be re-exported for every platform.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'What is an infographic video maker?',
          a: 'It is a tool that creates animated infographics — diagrams that move — and exports them as video. Infogiph generates the animation automatically from your text.',
        },
        {
          q: 'How do I make an infographic video?',
          a: 'Describe what you want to visualize, let Infogiph generate an animated diagram, edit anything you like, then export it as a GIF or MP4.',
        },
        {
          q: 'Can I export a video infographic as MP4?',
          a: 'Yes. Infogiph exports to both GIF and MP4, with animation preserved, in multiple aspect ratios for social and presentations.',
        },
        {
          q: 'Do I need video editing software?',
          a: 'No. Making infographics videos with Infogiph requires no After Effects, no timeline, and no rendering pipeline — the motion is generated for you.',
        },
        {
          q: 'Is the infographic video maker free?',
          a: 'You can start free. Animated GIF and MP4 exports are part of the paid plans for higher-volume and premium use.',
        },
        {
          q: 'What aspect ratios are supported?',
          a: 'Square (1:1), portrait/story (9:16), and landscape (16:9), among others — so your video infographic fits every platform.',
        },
      ]}
      related={[
        { label: 'Infographic Maker', href: '/infographic-maker' },
        { label: 'Free Infographic Maker', href: '/free-infographic-maker' },
        {
          label: 'How to make an infographic video',
          href: '/blog/how-to-make-an-infographic-video',
        },
        {
          label: 'Text to infographic generator',
          href: '/blog/text-to-infographic-generator',
        },
      ]}
    />
  );
}
