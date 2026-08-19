import type { BaseEmailProps } from '@/mail/types';
import {
  Container,
  Font,
  Head,
  Hr,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { createTranslator } from 'use-intl/core';

interface EmailLayoutProps extends BaseEmailProps {
  children: React.ReactNode;
  /** When set (lifecycle/marketing emails), renders an unsubscribe footer. */
  unsubscribeUrl?: string;
}

/**
 * Email Layout
 *
 * https://react.email/docs/components/tailwind
 */
export default function EmailLayout({
  locale,
  messages,
  children,
  unsubscribeUrl,
}: EmailLayoutProps) {
  const t = createTranslator({
    locale,
    messages,
  });

  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind>
        <Section className="bg-background p-4">
          <Container className="rounded-lg bg-card p-6 text-card-foreground">
            {children}

            <Hr className="my-8" />
            <Text className="mt-4">
              {t('Mail.common.team', { name: t('Metadata.name') })}
            </Text>
            <Text>
              {t('Mail.common.copyright', { year: new Date().getFullYear() })}
            </Text>
            {unsubscribeUrl ? (
              <Text className="text-xs text-gray-400">
                <Link href={unsubscribeUrl} className="text-gray-400 underline">
                  {t('Mail.common.unsubscribe')}
                </Link>
              </Text>
            ) : null}
          </Container>
        </Section>
      </Tailwind>
    </Html>
  );
}
