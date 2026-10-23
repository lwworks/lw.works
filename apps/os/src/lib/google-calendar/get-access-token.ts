import 'server-only'

import { auth } from '@/lib/auth/auth'

export class ReauthRequiredError extends Error {}

/** Google access token for the account via better-auth (refreshed when expiring, or when `forceRefresh`). */
export const getAccessToken = async ({ accountId, userId }: { accountId: string; userId: string }, forceRefresh = false) => {
  const body = { accountId, userId }
  const tokens = await (forceRefresh ? auth.api.refreshToken({ body }) : auth.api.getAccessToken({ body })).catch(() => null)
  if (!tokens?.accessToken) throw new ReauthRequiredError('Google access token unavailable')
  return tokens.accessToken
}
