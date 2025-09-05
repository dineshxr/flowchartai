'use client';

import { AuthCard } from '@/components/auth/auth-card';
import { FormError } from '@/components/shared/form-error';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SocialLoginButton } from './social-login-button';

export interface LoginFormProps {
  className?: string;
  callbackUrl?: string;
}

export const LoginForm = ({
  className,
  callbackUrl: propCallbackUrl,
}: LoginFormProps) => {
  const t = useTranslations('AuthPage.login');
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const paramCallbackUrl = searchParams.get('callbackUrl');
  const callbackUrl = propCallbackUrl || paramCallbackUrl || '/dashboard';

  return (
    <AuthCard
      headerLabel={t('welcomeBack')}
      bottomButtonLabel=""
      bottomButtonHref=""
      className={cn('', className)}
    >
      <div className="space-y-6">
        <div className="text-center text-muted-foreground">
          Sign in with your Google account to continue
        </div>
        <FormError message={urlError || undefined} />
        <SocialLoginButton callbackUrl={callbackUrl} />
      </div>
    </AuthCard>
  );
};
