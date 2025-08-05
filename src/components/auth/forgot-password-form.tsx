'use client';

import { AuthCard } from '@/components/auth/auth-card';
import { FormError } from '@/components/shared/form-error';
import { FormSuccess } from '@/components/shared/form-success';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const ForgotPasswordForm = ({ className }: { className?: string }) => {
  const t = useTranslations('AuthPage.forgotPassword');
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();

  const ForgotPasswordSchema = z.object({
    email: z.string().email({
      message: t('emailRequired'),
    }),
  });

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Pre-fill the email field if it's provided in the URL
  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      form.setValue('email', emailFromUrl);
    }
  }, [searchParams, form]);

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    // For Google OAuth, password reset is not applicable
    // Users need to manage their account through Google's account settings
    setIsPending(true);
    setError('');
    setSuccess('');

    // Simulate a short delay for better UX
    setTimeout(() => {
      setIsPending(false);
      setSuccess(
        'Password reset is not applicable for Google OAuth accounts. Please manage your account through Google settings.'
      );
    }, 1000);
  };

  return (
    <AuthCard
      headerLabel={t('title')}
      bottomButtonLabel={t('backToLogin')}
      bottomButtonHref={`${Routes.Login}`}
      className={cn('', className)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="name@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            size="lg"
            type="submit"
            className="w-full cursor-pointer"
          >
            {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            <span>{t('send')}</span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
