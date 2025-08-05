'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

/**
 * PasswordCardWrapper for Google OAuth users
 * Since we only use Google OAuth, we don't need password management
 */
export function PasswordCardWrapper() {
  const { data: session, status } = authClient.useSession();
  const t = useTranslations('Dashboard.settings');

  // Don't render anything while loading
  if (status === 'loading') {
    return <PasswordSkeletonCard />;
  }

  // For Google OAuth users, show a simple message
  if (session?.user) {
    return (
      <Card
        className={cn(
          'w-full max-w-lg md:max-w-xl overflow-hidden pt-6 pb-6 flex flex-col'
        )}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {t('security.title')}
          </CardTitle>
          <CardDescription>{t('security.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          <p className="text-sm text-muted-foreground">
            {t('security.resetPassword.info')}
          </p>
        </CardContent>
      </Card>
    );
  }

  // If user is not logged in, don't show anything
  return null;
}

function PasswordSkeletonCard() {
  const t = useTranslations('Dashboard.settings.security.updatePassword');
  return (
    <Card
      className={cn(
        'w-full max-w-lg md:max-w-xl overflow-hidden pt-6 pb-6 flex flex-col'
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-3 flex-1">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
    </Card>
  );
}
