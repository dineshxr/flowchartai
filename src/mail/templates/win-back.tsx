import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Heading, Text } from '@react-email/components';

interface WinBackProps extends BaseEmailProps {
  name: string;
  url: string;
  /** How many free generations the user still has. */
  creditsLeft: number;
}

/** Sent 7 days after signup to free users who went quiet. */
export function WinBack({
  name,
  url,
  creditsLeft,
  locale,
  messages,
}: WinBackProps) {
  const first = name?.split(' ')[0] || 'there';
  const credits =
    creditsLeft > 0
      ? `You still have ${creditsLeft} free AI generation${creditsLeft === 1 ? '' : 's'} on your account — they don't expire.`
      : 'Your saved work is still in your dashboard, ready to edit and export.';
  return (
    <EmailLayout locale={locale} messages={messages}>
      <Heading className="text-xl">One sentence → one infographic</Heading>
      <Text>
        Hi {first} — {credits}
      </Text>
      <Text>
        If a blank canvas is the hurdle, skip it: paste any paragraph — meeting
        notes, a how-it-works section, a plan — and Infogiph turns it into an
        animated diagram you can edit and export as PNG, SVG, GIF or MP4.
      </Text>
      <EmailButton href={url}>Pick up where you left off</EmailButton>
      <Text className="text-xs text-gray-500">
        Or start from one of 98 templates — CI/CD pipelines, timelines, org
        charts, marketing funnels — and just rename the boxes.
      </Text>
    </EmailLayout>
  );
}

WinBack.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  name: 'Alex',
  url: 'https://www.infogiph.com/canvas',
  creditsLeft: 3,
};

export default WinBack;
