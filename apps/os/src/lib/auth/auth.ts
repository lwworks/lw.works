import * as schema from '@/lib/db/schema/auth'
import { getPreviewOrigins } from '@/lib/auth/get-preview-origins'
import { PRODUCTION_URL } from '@/lib/auth/production-url'
import { getDb } from '@/lib/db/get-db'
import { GOOGLE_CALENDAR_SCOPE } from '@/lib/google-calendar/scope'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { oAuthProxy } from 'better-auth/plugins/oauth-proxy'

const previewOrigins = getPreviewOrigins()
// A preview with its own BETTER_AUTH_URL handles its Google callback itself (needs its redirect URI registered).
const proxiesThroughProduction = previewOrigins.length > 0 && !process.env.BETTER_AUTH_URL
// Production must run the proxy too: it handles the Google callback for previews and hands the profile back.
// Off locally, where the plugin would otherwise proxy every non-production origin, localhost included.
const usesOAuthProxy = process.env.VERCEL_ENV === 'production' || proxiesThroughProduction

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: 'pg',
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || previewOrigins[0],
  basePath: '/api/auth',
  trustedOrigins: previewOrigins,
  emailAndPassword: {
    enabled: false,
  },
  account: {
    encryptOAuthTokens: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: proxiesThroughProduction ? `${PRODUCTION_URL}/api/auth/callback/google` : undefined,
      hd: 'lw.works',
      prompt: 'select_account consent',
      accessType: 'offline',
      scope: [GOOGLE_CALENDAR_SCOPE],
    },
  },
  plugins: [...(usesOAuthProxy ? [oAuthProxy({ productionURL: PRODUCTION_URL })] : []), nextCookies()],
})
