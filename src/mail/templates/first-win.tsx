import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Heading, Text } from '@react-email/components';

interface FirstWinProps extends BaseEmailProps {
  name: string;
  url: string;
  unsubscribeUrl?: string;
}

/**
 * Day-1 onboarding, sent only to users who haven't generated anything yet.
 * One job: remove the blank-canvas hurdle with prompts they can paste as-is.
 */
export function FirstWin({
  name,
  url,
  unsubscribeUrl,
  locale,
  messages,
}: FirstWinProps) {
  const first = name?.split(' ')[0] || 'there';
  return (
    <EmailLayout
      locale={locale}
      messages={messages}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading className="text-xl">
        The blank canvas is the only hard part
      </Heading>
      <Text>
        Hi {first} — most people who make sharp-looking diagrams don&apos;t
        start from nothing. They start from a sentence. Paste any one of these
        into the canvas and watch it become an animated diagram in about 60
        seconds:
      </Text>
      <Text className="text-sm text-gray-600">
        &quot;How our product turns a signup into a paying customer&quot;
      </Text>
      <Text className="text-sm text-gray-600">
        &quot;The 5 tools in my daily workflow and how they connect&quot;
      </Text>
      <Text className="text-sm text-gray-600">
        &quot;What actually happens when a user clicks Buy&quot;
      </Text>
      <EmailButton href={url}>Paste one and watch it build</EmailButton>
      <Text className="text-xs text-gray-500">
        Each one costs a single free generation, and everything it makes is
        yours to edit, restyle, and export.
      </Text>
    </EmailLayout>
  );
}

FirstWin.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  name: 'Alex',
  url: 'https://www.infogiph.com/canvas',
  unsubscribeUrl: 'https://www.infogiph.com/api/email/unsubscribe?u=1&t=x',
};

export default FirstWin;
