'use client';

import { websiteConfig } from '@/config/website';
import { useCurrentUser } from '@/hooks/use-current-user';
import { authClient } from '@/lib/auth-client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface GoogleOneTapProviderProps {
  children: React.ReactNode;
}

export const GoogleOneTapProvider = ({
  children,
}: GoogleOneTapProviderProps) => {
  const currentUser = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log('🔍 Google One Tap - initializing...');
    console.log('👤 User:', currentUser);
    console.log('📍 Path:', pathname);
    console.log('⚙️ Feature enabled:', websiteConfig.auth.enableGoogleOneTap);

    // 简单条件：只在首页且未登录时显示
    if (
      !websiteConfig.auth.enableGoogleOneTap ||
      pathname !== '/' ||
      currentUser?.id
    ) {
      console.log('❌ Conditions not met, skipping One Tap');
      return;
    }

    console.log('✅ Conditions met, initializing Better Auth One Tap...');

    const initializeOneTap = async () => {
      try {
        console.log('🎯 Calling Better Auth oneTap...');

        // Google One Tap is not supported with NextAuth.js
        // We'll disable this feature for now
        console.log('Google One Tap is not supported with NextAuth.js');
      } catch (error) {
        console.error('❌ Error initializing Better Auth One Tap:', error);
        // 降级到普通登录
        router.push('/auth/login');
      }
    };

    // 延迟初始化，避免页面加载时的冲突
    const timer = setTimeout(() => {
      initializeOneTap();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [currentUser, pathname, router]);

  return <>{children}</>;
};

export default GoogleOneTapProvider;
