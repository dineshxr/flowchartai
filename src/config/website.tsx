import type { WebsiteConfig } from '@/types';

/**
 * website config, without translations
 *
 * docs:
 * https://mksaas.com/docs/config/website
 */
export const websiteConfig: WebsiteConfig = {
  metadata: {
    theme: {
      defaultTheme: 'default',
      enableSwitch: true,
    },
    mode: {
      defaultMode: 'system',
      enableSwitch: true,
    },
    images: {
      // Dynamic, Infogiph-branded Open Graph image (see src/app/api/og/route.tsx).
      // Used as the default og:image for any page that doesn't set its own.
      ogImage: '/api/og',
      logoLight: '/logo.png',
      logoDark: '/logo.png',
    },
    social: {
      github: 'https://github.com/tanchaowen84/flowchartai',
      twitter: 'https://x.com/tanchaowen84',
    },
  },
  features: {
    enableDiscordWidget: false,
    enableUpgradeCard: true,
    enableAffonsoAffiliate: false,
    enablePromotekitAffiliate: false,
    enableDocsPage: false,
    enableAIPages: false,
  },
  routes: {
    defaultLoginRedirect: '/dashboard',
  },
  analytics: {
    enableVercelAnalytics: true,
    enableSpeedInsights: false,
  },
  auth: {
    enableGoogleLogin: true,
    enableGithubLogin: false,
    enableGoogleOneTap: false, // 暂时禁用以解决 FedCM 兼容性问题
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        flag: '🇺🇸',
        name: 'English',
      },
      // zh: {
      //   flag: '🇨🇳',
      //   name: '中文',
      // },
    },
  },
  blog: {
    paginationSize: 6,
    relatedPostsSize: 3,
  },
  mail: {
    provider: 'resend',
    fromEmail: 'InfoGiph <noreply@infogiph.com>',
    supportEmail: 'InfoGiph Support <support@infogiph.com>',
  },
  newsletter: {
    provider: 'resend',
    autoSubscribeAfterSignUp: true,
  },
  storage: {
    provider: 'firebase',
  },
};
