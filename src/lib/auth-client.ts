import {
  adminClient,
  inferAdditionalFields,
  oneTapClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { auth } from './auth';
import { getBaseUrl } from './urls/urls';

/**
 * https://www.better-auth.com/docs/installation#create-client-instance
 */
export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    // https://www.better-auth.com/docs/plugins/admin#add-the-client-plugin
    adminClient(),
    // https://www.better-auth.com/docs/concepts/typescript#inferring-additional-fields-on-client
    inferAdditionalFields<typeof auth>(),
    // https://www.better-auth.com/docs/plugins/one-tap
    ...(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      ? [
          oneTapClient({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            autoSelect: false,
            cancelOnTapOutside: true,
            context: 'signin',
          }),
        ]
      : []),
  ],
});
