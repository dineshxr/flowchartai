import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/ai-genogram-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free AI Genogram Maker & Online Family Tree Generator',
  description:
    'Build genograms and family trees online with AI. Describe family members and relationships in plain text and Infogiph draws the diagram — generations, partners, children — free, editable, and exportable.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('AI Genogram Maker')}&subtitle=${encodeURIComponent('Family trees and genogram-style diagrams from text.')}`,
});

export default function AiGenogramMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Free AI Genogram & Family Tree Maker"
      title="Map your family tree with an AI genogram maker"
      subtitle="List the people and how they're related — 'Maria and John married, three children: Ana, Luis, and Sofia; Ana married Tom…' — and Infogiph draws the family diagram for you. Generations aligned, relationships connected, everything editable."
      ctaText="Build a family tree free"
      benefits={[
        {
          title: 'Describe the family, get the diagram',
          body: 'No dragging boxes per person. Write the family structure in plain sentences and the AI turns it into a connected, multi-generation diagram in seconds.',
        },
        {
          title: 'Generations aligned automatically',
          body: 'Grandparents, parents, and children land on clean generational rows with couple and parent-child connections drawn for you.',
        },
        {
          title: 'Genogram-style relationship mapping',
          body: 'Go beyond a basic family tree: annotate relationships, mark households, and capture the family patterns that genograms are used to explore.',
        },
        {
          title: 'Private by default',
          body: 'Your family diagrams are saved to your account and are not published anywhere. Export copies only when you choose to.',
        },
        {
          title: 'Easy to update as families grow',
          body: 'New baby? New marriage? Add a sentence and regenerate, or edit the diagram directly on the canvas. No re-drawing the whole tree.',
        },
        {
          title: 'Share-ready exports',
          body: 'Export PNG, GIF, or MP4 free for family newsletters, genealogy projects, school assignments, or counseling coursework. Paid plans remove the small Infogiph watermark.',
        },
      ]}
      body={[
        {
          heading: 'Genogram vs family tree: what are you making?',
          paragraphs: [
            'A family tree shows who is related to whom — ancestors, descendants, marriages. A genogram goes further: it layers relationship quality, patterns, and history onto that structure, which is why counselors, therapists, social workers, and medical professionals use them.',
            "Infogiph's AI generates the underlying family structure from your text — people, partners, children, generations — and gives you an editable canvas to annotate it genogram-style: label relationships, add notes, and color-code patterns you want to track.",
          ],
        },
        {
          heading: 'How the online family tree generator works',
          paragraphs: [
            'Write the family out in plain language, one relationship at a time — it can be as simple as "Grandpa Joe and Grandma May had two kids: my dad Sam and my aunt Rita. Rita has one son, Leo." The AI parses names, partnerships, and parent-child links, then lays out the tree by generation.',
            'From there, edit freely: rename people, add birth years, mark deceased members, adjust colors, and draw extra relationship lines. When it looks right, export a crisp PNG for printing — or a GIF or MP4 if you want the tree to build itself generation by generation.',
          ],
        },
        {
          heading: 'Who uses an AI genogram maker?',
          paragraphs: [
            'Genealogy hobbyists sketch their research before committing it to formal software. Students in psychology, social work, and nursing produce genogram assignments in minutes instead of hours. Families make wedding, reunion, and memorial displays. Counselors draft client family structures quickly during intake.',
            'Because generation happens from text, you can start from notes you already have — an interview with a grandparent, a family history email thread — and see the structure immediately.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is the genogram maker free?',
          a: 'Yes. Full editing and unlimited GIF, MP4, and PNG exports are included on the free plan, alongside 5 AI generations. No credit card required.',
        },
        {
          q: 'How many generations can I include?',
          a: 'As many as you can describe. Three to four generations fit comfortably on one canvas; for very large trees, you can split branches into linked diagrams.',
        },
        {
          q: 'Does it support standard genogram symbols?',
          a: 'The AI generates the family structure with clear person nodes and relationship lines, and the editor lets you style elements and add annotations. For strict clinical notation, you can customize shapes and labels on the canvas.',
        },
        {
          q: 'Is my family data private?',
          a: "Yes — diagrams are stored in your account and never published. You control what's exported and shared.",
        },
        {
          q: 'Can I make a family tree without any design skills?',
          a: "That's the point: you write sentences, the AI draws the tree. Editing is drag-and-drop simple afterwards.",
        },
        {
          q: 'Can I print the family tree?',
          a: 'Export a PNG and print it at whatever size you need — the exported image is generous enough for anything from a handout to a large poster print.',
        },
      ]}
      related={[
        {
          label: 'How to make a genogram',
          href: '/blog/how-to-make-a-genogram',
        },
        { label: 'AI Org Chart Maker', href: '/ai-org-chart-maker' },
        { label: 'AI Timeline Maker', href: '/ai-timeline-maker' },
        { label: 'People & org templates', href: '/templates/org-people' },
      ]}
    />
  );
}
