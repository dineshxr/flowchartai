import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Heading, Text } from '@react-email/components';

interface CapHitProps extends BaseEmailProps {
  name: string;
  url: string;
}

/**
 * Sent ~24h after a free user burns their last credit. The in-product cap
 * modal already pitched once; this is the considered second touch.
 */
export function CapHit({ name, url, locale, messages }: CapHitProps) {
  const first = name?.split(' ')[0] || 'there';
  return (
    <EmailLayout locale={locale} messages={messages}>
      <Heading className="text-xl">
        {first}, your diagrams are still here
      </Heading>
      <Text>
        Yesterday you used the last of your 5 free AI generations — which means
        you actually put Infogiph to work. Everything you made is saved in your
        dashboard, watermark and all.
      </Text>
      <Text>
        If you want to keep going, Pro gives you 500 generations a month,
        removes the watermark, and unlocks 2K/4K exports — for $12/month, or
        $9/month billed yearly. Cancel anytime from your dashboard.
      </Text>
      <EmailButton href={url}>Continue with Pro</EmailButton>
      <Text className="text-xs text-gray-500">
        Have feedback instead? Just reply — a human reads these, and if
        something stopped you from upgrading we genuinely want to know what.
      </Text>
    </EmailLayout>
  );
}

CapHit.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  name: 'Alex',
  url: 'https://www.infogiph.com/pricing',
};

export default CapHit;
