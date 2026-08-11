import { defaultMessages } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import EmailButton from '@/mail/components/email-button';
import EmailLayout from '@/mail/components/email-layout';
import type { BaseEmailProps } from '@/mail/types';
import { Heading, Text } from '@react-email/components';

interface LinkedinPlaybookProps extends BaseEmailProps {
  name: string;
  url: string;
  unsubscribeUrl?: string;
}

/**
 * Day-5 onboarding: the LinkedIn playbook. The product's sharpest use case —
 * animated diagrams that autoplay in the feed and make the author look like
 * the person who understands the system best.
 */
export function LinkedinPlaybook({
  name,
  url,
  unsubscribeUrl,
  locale,
  messages,
}: LinkedinPlaybookProps) {
  const first = name?.split(' ')[0] || 'there';
  return (
    <EmailLayout
      locale={locale}
      messages={messages}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading className="text-xl">
        Text posts get skimmed. Motion gets watched.
      </Heading>
      <Text>
        {first}, the people who build an audience on LinkedIn aren&apos;t
        writing better paragraphs — they&apos;re packaging ideas so the feed
        stops moving. An animated diagram autoplays right in the feed, and it
        signals something a wall of text never will: this person actually
        understands the system.
      </Text>
      <Text>The post format, in three moves:</Text>
      <Text className="text-sm text-gray-700">
        1. One idea per diagram. Five to seven boxes, no more — restraint is
        what reads as expertise.
      </Text>
      <Text className="text-sm text-gray-700">
        2. Export as MP4 or GIF. Motion autoplays in the LinkedIn feed; a static
        screenshot competes, a moving one interrupts.
      </Text>
      <Text className="text-sm text-gray-700">
        3. First line names the problem. The diagram carries the insight. The
        last line asks a question so the comments do your distribution.
      </Text>
      <EmailButton href={url}>Turn an idea into a post</EmailButton>
      <Text className="text-xs text-gray-500">
        Posting for a mobile audience? Use the portrait export preset — it takes
        up more of the feed on a phone screen.
      </Text>
    </EmailLayout>
  );
}

LinkedinPlaybook.PreviewProps = {
  locale: routing.defaultLocale,
  messages: defaultMessages,
  name: 'Alex',
  url: 'https://www.infogiph.com/canvas',
  unsubscribeUrl: 'https://www.infogiph.com/api/email/unsubscribe?u=1&t=x',
};

export default LinkedinPlaybook;
