import * as schema from '@/lib/db/schema/auth'
import { getDb } from '@/lib/db/get-db'
import { GOOGLE_CALENDAR_SCOPE } from '@/lib/google-calendar/scope'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
    provider: 'pg',
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/api/auth',
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
      hd: 'lw.works',
      prompt: 'select_account consent',
      accessType: 'offline',
      scope: [GOOGLE_CALENDAR_SCOPE],
    },
  },
  plugins: [nextCookies()],
})
