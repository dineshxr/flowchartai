import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Heading, Hr, Link, Section, Text } from '@react-email/components';

export interface DigestTemplatePick {
  title: string;
  description: string;
  url: string;
}

interface WeeklyDigestProps extends BaseEmailProps {
  name: string;
  /** Format of the week (a canvas layout) with an expert when-to-use blurb. */
  formatName: string;
  formatBlurb: string;
  formatUrl: string;
  /** Three rotating template picks from the catalog. */
  picks: DigestTemplatePick[];
  /** One rotating LinkedIn posting tip. */
  recipe: string;
  unsubscribeUrl?: string;
}

/**
 * Tuesday digest for active users: one format worth learning, three templates
 * worth stealing, one LinkedIn recipe. Content rotates deterministically from
 * the template catalog (see src/lib/digest-content.ts) — no manual curation.
 */
export function WeeklyDigest({
  name,
  formatName,
  formatBlurb,
  formatUrl,
  picks,
  recipe,
  unsubscribeUrl,
  locale,
  messages,
}: WeeklyDigestProps) {
  const first = name?.split(' ')[0] || 'there';
  return (
    <EmailLayout
      locale={locale}
      messages={messages}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading className="text-xl">This week on Infogiph</Heading>
      <Text>
        {first}, three things worth two minutes — a format to learn, templates
        to steal, and one posting habit that compounds.
      </Text>

      <Section>
        <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Format of the week
        </Text>
        <Text className="font-semibold">{formatName}</Text>
        <Text className="text-sm text-gray-700">{formatBlurb}</Text>
        <Text className="text-sm">
          <Link href={formatUrl} className="text-blue-600 underline">
            Try the {formatName} format →
          </Link>
        </Text>
      </Section>

      <Hr className="my-4" />

      <Section>
        <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Templates worth stealing
        </Text>
        {picks.map((p) => (
          <Text key={p.url} className="text-sm">
            <Link href={p.url} className="font-semibold text-blue-600">
              {p.title}
            </Link>
            <br />
            <span className="text-gray-700">{p.description}</span>
          </Text>
        ))}
      </Section>

      <Hr className="my-4" />

      <Section>
        <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          This week&apos;s LinkedIn recipe
        </Text>
        <Text className="text-sm text-gray-700">{recipe}</Text>
      </Section>

      <EmailButton href={formatUrl}>Open the canvas</EmailButton>
    </EmailLayout>
  );
}

WeeklyDigest.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  name: 'Alex',
  formatName: 'Orbit',
  formatBlurb:
    'Satellites revolving around a hub. Use it when the parts of your system are peers — tools in a stack, channels in a strategy — and the center is the thing they all serve.',
  formatUrl: 'https://www.infogiph.com/canvas',
  picks: [
    {
      title: 'SaaS Architecture',
      description: 'The classic services-around-a-core diagram.',
      url: 'https://www.infogiph.com/templates/saas-architecture',
    },
    {
      title: 'Launch Timeline',
      description: 'Milestones in motion, left to right.',
      url: 'https://www.infogiph.com/templates/launch-timeline',
    },
    {
      title: 'Marketing Funnel',
      description: 'Awareness to revenue in five stages.',
      url: 'https://www.infogiph.com/templates/marketing-funnel',
    },
  ],
  recipe:
    'Post at the hour your audience starts work, not yours. A diagram that lands at 8:55am local gets the commute scroll.',
  unsubscribeUrl: 'https://www.infogiph.com/api/email/unsubscribe?u=1&t=x',
};

export default WeeklyDigest;
