'use client';

import { GoogleIcon } from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { authClient } from '@/lib/auth-client';
import { getUrlWithLocaleInCallbackUrl } from '@/lib/urls/urls';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { Loader2Icon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface SocialLoginButtonProps {
  callbackUrl?: string;
}

/**
 * Google sign-in button (the only supported sign-in method).
 */
export const SocialLoginButton = ({
  callbackUrl: propCallbackUrl,
}: SocialLoginButtonProps) => {
  if (!websiteConfig.auth.enableGoogleLogin) {
    return null;
  }

  const t = useTranslations('AuthPage.login');
  const searchParams = useSearchParams();
  const paramCallbackUrl = searchParams.get('callbackUrl');
  const locale = useLocale();
  const defaultCallbackUrl = getUrlWithLocaleInCallbackUrl(
    DEFAULT_LOGIN_REDIRECT,
    locale
  );
  const callbackUrl = propCallbackUrl || paramCallbackUrl || defaultCallbackUrl;
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: callbackUrl,
      });
      if (result?.error) {
        console.error('google sign-in error', result.error);
        setIsLoading(false);
      }
      // On success, signIn redirects the browser.
    } catch (error) {
      console.error('google sign-in error', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full cursor-pointer"
      variant="outline"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2Icon className="mr-2 size-4 animate-spin" />
      ) : (
        <GoogleIcon className="size-4 mr-2" />
      )}
      <span>{t('signInWithGoogle')}</span>
    </Button>
  );
};
