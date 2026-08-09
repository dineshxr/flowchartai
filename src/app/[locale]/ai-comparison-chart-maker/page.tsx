import { LandingPage } from '@/components/blocks/infogiph-landing/landing-page';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/urls';
import type { Metadata } from 'next';

const PATH = '/ai-comparison-chart-maker';

export const metadata: Metadata = constructMetadata({
  title: 'Free AI Comparison Chart Maker: Generate Infographics in 30s',
  description:
    'Create comparison charts with AI in about 30 seconds. Describe the options you are comparing and Infogiph builds a clean, editable comparison infographic — free, no design skills, export to GIF, MP4 & PNG.',
  canonicalUrl: `${getBaseUrl()}${PATH}`,
  image: `/api/og?title=${encodeURIComponent('AI Comparison Chart Maker')}&subtitle=${encodeURIComponent('Generate comparison infographics in 30 seconds — free.')}`,
});

export default function AiComparisonChartMakerPage() {
  return (
    <LandingPage
      canonicalPath={PATH}
      eyebrow="Free AI Comparison Chart Maker"
      title="Generate comparison charts with AI in 30 seconds"
      subtitle="Stop fiddling with tables and text boxes. Tell Infogiph what you're comparing — products, plans, tools, ideas — and the AI lays out a polished comparison chart infographic you can edit and export for free."
      ctaText="Make a comparison chart free"
      benefits={[
        {
          title: 'From prompt to chart in ~30 seconds',
          body: 'Type something like "Compare Notion, Asana, and Trello on price, collaboration, and learning curve" and get a finished comparison chart — columns, rows, icons, and all.',
        },
        {
          title: 'AI structures the comparison for you',
          body: 'The AI extracts the options and criteria from your description and arranges them into a scannable side-by-side layout, so nothing gets buried in paragraphs.',
        },
        {
          title: 'Beyond boring tables',
          body: 'Comparison charts render as designed infographics with icons, color accents, and visual hierarchy — not a spreadsheet screenshot.',
        },
        {
          title: 'Every cell stays editable',
          body: 'Swap criteria, reword rows, change colors, add or remove columns. The generated chart is a starting point you fully control on the canvas.',
        },
        {
          title: 'Free exports that look professional',
          body: 'Download your comparison chart as a PNG, GIF, or MP4 on the free plan — ready for blog posts, pricing pages, decks, and social. Paid plans remove the small Infogiph watermark.',
        },
        {
          title: 'Works for any comparison',
          body: 'Product vs product, plan vs plan, before vs after, us vs competitors, pros vs cons — if it has two or more options, Infogiph can chart it.',
        },
      ]}
      body={[
        {
          heading: 'What is an AI comparison chart maker?',
          paragraphs: [
            'A comparison chart maker is a tool that turns a set of options and criteria into a side-by-side visual. The AI version skips the tedious part: instead of drawing tables and aligning columns yourself, you describe the comparison in plain language and the AI generates the chart — structure, layout, icons, and labels included.',
            "Infogiph's comparison chart generator reads your text, identifies what you're comparing and on which dimensions, and produces an editable comparison infographic in about 30 seconds. It's the difference between an hour in a design tool and a coffee-break edit.",
          ],
        },
        {
          heading: 'How to make a comparison chart with AI',
          paragraphs: [
            'First, describe the comparison: name the options and the criteria that matter ("Compare our Starter, Pro, and Enterprise plans on price, seats, support, and integrations"). Second, let the AI generate the chart — it builds the grid, fills the cells, and applies a clean visual style. Third, refine: edit any text, adjust colors to match your brand, and export.',
            "You can also paste longer source material — a features doc, meeting notes, or research summary — and let Infogiph's text-to-visual AI pull out the comparison for you. That's especially useful for competitor analysis and buying guides where the raw information already exists in prose.",
          ],
        },
        {
          heading: 'Where comparison chart infographics shine',
          paragraphs: [
            'Pricing pages and plan comparisons convert better when readers can scan differences at a glance. Marketers use comparison infographics for "X vs Y" content that ranks and gets shared. Product teams compare vendors and tools before buying. Students and researchers contrast theories, methods, or case studies.',
            'Because Infogiph exports clean PNG, GIF, and MP4 files for free — animated versions included — one generated chart works across your blog, deck, docs, and social channels without redesigning it each time.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is the AI comparison chart maker really free?',
          a: 'Yes. The free plan includes AI generation, the full canvas editor, and unlimited GIF, MP4, and PNG exports — no credit card required. Paid plans remove the Infogiph watermark and add generation volume.',
        },
        {
          q: 'How fast can I generate a comparison chart?',
          a: 'Most comparison charts generate in roughly 15–30 seconds from a one-sentence prompt. Edits on the canvas are instant.',
        },
        {
          q: 'Can I compare more than two things?',
          a: 'Yes. Describe as many options and criteria as you need — three plans, five tools, ten features — and the AI arranges them into a readable grid.',
        },
        {
          q: 'Can I edit the chart after the AI generates it?',
          a: 'Everything is editable: text, colors, icons, rows, and columns. You can also re-run the AI on a section until the structure is right.',
        },
        {
          q: 'What formats can I export a comparison chart in?',
          a: 'Three: static PNG, animated GIF, and MP4 video. All of them are free, including the animated ones that work so well for social posts and ads — paid plans just remove the Infogiph watermark.',
        },
        {
          q: 'Do comparison charts come out as tables or infographics?',
          a: 'Infogiph generates designed comparison infographics — visual grids with icons, color, and hierarchy — rather than plain spreadsheet-style tables.',
        },
      ]}
      related={[
        {
          label: 'How to make a comparison chart',
          href: '/blog/how-to-make-a-comparison-chart',
        },
        { label: 'AI Venn Diagram Maker', href: '/ai-venn-diagram-maker' },
        { label: 'AI Timeline Maker', href: '/ai-timeline-maker' },
        { label: 'Business templates', href: '/templates/business' },
        { label: 'Infographic Maker', href: '/infographic-maker' },
      ]}
    />
  );
}
