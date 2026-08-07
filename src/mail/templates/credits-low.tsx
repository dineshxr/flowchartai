import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Heading, Text } from '@react-email/components';

interface CreditsLowProps extends BaseEmailProps {
  name: string;
  url: string;
}

/** Sent when a free user has exactly 1 AI generation left. */
export function CreditsLow({ name, url, locale, messages }: CreditsLowProps) {
  const first = name?.split(' ')[0] || 'there';
  return (
    <EmailLayout locale={locale} messages={messages}>
      <Heading className="text-xl">
        {first}, you have 1 free generation left
      </Heading>
      <Text>
        You&apos;ve been putting your free credits to work — there&apos;s one AI
        generation remaining on your account. Everything you&apos;ve made stays
        saved and editable either way.
      </Text>
      <Text>
        If Infogiph is earning a spot in your workflow, Pro is $12/month (or
        $9/month billed yearly) and unlocks:
      </Text>
      <Text className="text-sm text-gray-700">
        • 500 AI generations every month
        <br />• Watermark-free exports
        <br />• 2K &amp; 4K video, GIF and image quality
        <br />• Unlimited exports
      </Text>
      <EmailButton href={url}>Upgrade to Pro</EmailButton>
      <Text className="text-xs text-gray-500">
        Not ready? No problem — your last credit and all your work will be here
        when you need them.
      </Text>
    </EmailLayout>
  );
}

CreditsLow.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  name: 'Alex',
  url: 'https://www.infogiph.com/pricing',
};

export default CreditsLow;
