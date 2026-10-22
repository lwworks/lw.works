import { getDb } from '@/db'
import * as schema from '@/db/auth-schema'
import { GOOGLE_CALENDAR_SCOPE } from '@/lib/google-calendar/scope'
import { refreshGoogleAccessToken } from '@/lib/google-calendar/token-refresh'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { headers } from 'next/headers'
import { cache } from 'react'

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
      refreshAccessToken: (refreshToken) => refreshGoogleAccessToken(refreshToken),
    },
  },
  plugins: [nextCookies()],
})

export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
})
