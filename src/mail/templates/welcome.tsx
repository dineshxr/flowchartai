import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Heading, Text } from '@react-email/components';

interface WelcomeProps extends BaseEmailProps {
  name: string;
  url: string;
  unsubscribeUrl?: string;
}

/**
 * Day-0 welcome. Goal: get the first AI generation to happen — the funnel
 * shows users who never generate never come back.
 */
export function Welcome({
  name,
  url,
  unsubscribeUrl,
  locale,
  messages,
}: WelcomeProps) {
  const first = name?.split(' ')[0] || 'there';
  return (
    <EmailLayout
      locale={locale}
      messages={messages}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading className="text-xl">Welcome to Infogiph, {first} 👋</Heading>
      <Text>
        You have 5 free AI generations waiting. The fastest way to see what
        Infogiph can do: describe anything — a process, a launch plan, a system
        — in one sentence, and watch it become an animated infographic.
      </Text>
      <Text className="text-sm text-gray-600">
        Try pasting this into the canvas: &quot;Customer onboarding: sign up,
        verify email, invite team, first project, success check-in&quot;
      </Text>
      <EmailButton href={url}>Create your first infographic</EmailButton>
      <Text className="text-xs text-gray-500">
        Prefer to start from something ready-made? There are 98 editable
        templates — flowcharts, timelines, org charts and more — one click from
        the same canvas.
      </Text>
    </EmailLayout>
  );
}

Welcome.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  name: 'Alex',
  url: 'https://www.infogiph.com/canvas',
};

export default Welcome;
