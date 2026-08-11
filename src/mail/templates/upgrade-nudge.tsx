import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Heading, Text } from '@react-email/components';

interface UpgradeNudgeProps extends BaseEmailProps {
  name: string;
  url: string;
  unsubscribeUrl?: string;
}

/**
 * Second upgrade touch, ~4 days after the cap was hit (capHit email was the
 * first). Different angle: not "more credits" but credibility — the watermark
 * undercuts work that's going in front of an audience.
 */
export function UpgradeNudge({
  name,
  url,
  unsubscribeUrl,
  locale,
  messages,
}: UpgradeNudgeProps) {
  const first = name?.split(' ')[0] || 'there';
  return (
    <EmailLayout
      locale={locale}
      messages={messages}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading className="text-xl">
        Your next post shouldn&apos;t advertise us
      </Heading>
      <Text>
        {first}, you made five diagrams — the thinking in them is yours. But if
        they&apos;re going in front of clients, your team, or your LinkedIn
        audience, the watermark in the corner gives us the credit on posts that
        are supposed to build your brand. That&apos;s backwards.
      </Text>
      <Text>
        Pro removes the watermark from every export, raises you to 500
        generations a month, and unlocks 2K/4K resolution — the difference is
        visible when a diagram goes full-screen in a deck. $12/month, or
        $9/month billed yearly. Cancel anytime.
      </Text>
      <EmailButton href={url}>Go watermark-free</EmailButton>
      <Text className="text-xs text-gray-500">
        Not ready? Your saved diagrams aren&apos;t going anywhere. And if
        something specific is holding you back, reply and tell us — a human
        reads these.
      </Text>
    </EmailLayout>
  );
}

UpgradeNudge.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  name: 'Alex',
  url: 'https://www.infogiph.com/pricing',
  unsubscribeUrl: 'https://www.infogiph.com/api/email/unsubscribe?u=1&t=x',
};

export default UpgradeNudge;
