import { withContentCollections } from '@content-collections/next';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * https://nextjs.org/docs/app/api-reference/config/next-config-js
 */
const nextConfig: NextConfig = {
  devIndicators: false,

  // firebase-admin (v14) pulls in ESM-only `jose@6`. If Next bundles it into the
  // serverless function, webpack emits a `require()` of that ESM module and the
  // function crashes at runtime with "require() of ES Module not supported"
  // (breaks /api/auth/session and anything calling getSession, e.g. /api/ai/*).
  // Marking it external leaves it in node_modules so Node loads the ESM deps
  // natively. Works in `next dev` regardless, so this only shows up in prod.
  serverExternalPackages: ['firebase-admin'],

  // Remove all console.* calls in production only
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Add CORS headers and API route headers
  async headers() {
    return [
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.infogiph.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },

  // Add redirects for proper domain handling
  async redirects() {
    return [
      // Redirect non-www to www to prevent CORS issues with auth
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'infogiph.com',
          },
        ],
        destination: 'https://www.infogiph.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'flowchartai-wine.vercel.app',
          },
        ],
        destination: 'https://www.infogiph.com/:path*',
        permanent: true,
      },
      {
        source: '/blog/flowchart-symbols',
        destination: '/blog/flowchart-symbols-guide',
        permanent: true,
      },
      {
        source: '/:locale/blog/flowchart-symbols',
        destination: '/:locale/blog/flowchart-symbols-guide',
        permanent: true,
      },
      {
        source: '/tools/ai-flowchart-generator',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:locale/tools/ai-flowchart-generator',
        destination: '/:locale',
        permanent: true,
      },
      {
        source: '/tools/flowchart-maker-ai',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:locale/tools/flowchart-maker-ai',
        destination: '/:locale',
        permanent: true,
      },
    ];
  },

  images: {
    // Cloudflare Workers requires unoptimized images
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'html.tailus.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.flowchartai.org',
      },
    ],
  },

  // Production optimizations
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
};

/**
 * You can specify the path to the request config file or use the default one (@/i18n/request.ts)
 *
 * https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#next-config
 */
const withNextIntl = createNextIntlPlugin();

/**
 * withContentCollections must be the outermost plugin
 *
 * https://www.content-collections.dev/docs/quickstart/next
 */
export default withContentCollections(withNextIntl(nextConfig));

// OpenNext Cloudflare development support.
// DISABLED: this project deploys to Vercel, not Cloudflare. Running the
// Cloudflare dev proxy on every `next dev` boot broke client module loading in
// dev (RSC "Cannot read properties of undefined (reading 'call')" on every
// route). Re-enable only if you actually run the Workers/OpenNext dev runtime.
const ENABLE_CLOUDFLARE_DEV = false;
if (ENABLE_CLOUDFLARE_DEV && process.env.NODE_ENV === 'development') {
  import('@opennextjs/cloudflare')
    .then(({ initOpenNextCloudflareForDev }) => {
      initOpenNextCloudflareForDev();
    })
    .catch(() => {
      // Silently fail if package is not available
    });
}
