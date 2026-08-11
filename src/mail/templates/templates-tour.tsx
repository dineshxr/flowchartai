import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Heading, Text } from '@react-email/components';

interface TemplatesTourProps extends BaseEmailProps {
  name: string;
  url: string;
  /** Live template count, passed by the cron so copy never goes stale. */
  templateCount: number;
  unsubscribeUrl?: string;
}

/**
 * Day-3 onboarding: the template library. Positioning — experts reuse proven
 * structures; the library is a head start, not a crutch.
 */
export function TemplatesTour({
  name,
  url,
  templateCount,
  unsubscribeUrl,
  locale,
  messages,
}: TemplatesTourProps) {
  const first = name?.split(' ')[0] || 'there';
  return (
    <EmailLayout
      locale={locale}
      messages={messages}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading className="text-xl">
        Experts don&apos;t start from scratch
      </Heading>
      <Text>
        {first}, the polished diagrams you see in decks and LinkedIn posts
        aren&apos;t designed from zero. They reuse structures that already work:
        the funnel, the pipeline, the orbit, the org chart. The design thinking
        is done — the ideas are the only original part.
      </Text>
      <Text>
        Infogiph has {templateCount} of these structures ready to put your name
        on: system architectures, launch timelines, marketing funnels, decision
        trees. Open one, rename the boxes, and it reads like you spent an
        afternoon on it.
      </Text>
      <Text>
        One habit worth stealing: pick the layout that matches the{' '}
        <em>shape</em> of your idea. Steps in order want a pipeline. A thing
        with moving parts wants an orbit. A ranking wants a pyramid.
      </Text>
      <EmailButton href={url}>Browse the template library</EmailButton>
      <Text className="text-xs text-gray-500">
        Every template is fully editable on the canvas — swap icons for real
        brand logos, recolor the connections, then export as PNG, GIF, or MP4.
      </Text>
    </EmailLayout>
  );
}

TemplatesTour.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  name: 'Alex',
  url: 'https://www.infogiph.com/templates',
  templateCount: 104,
  unsubscribeUrl: 'https://www.infogiph.com/api/email/unsubscribe?u=1&t=x',
};

export default TemplatesTour;
