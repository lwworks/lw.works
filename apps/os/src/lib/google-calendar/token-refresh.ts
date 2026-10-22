import { AsyncLocalStorage } from 'node:async_hooks'
import { refreshAccessToken } from 'better-auth/oauth2'

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'

/**
 * better-auth 1.7.2 replaces every refresh failure with FAILED_TO_REFRESH_ACCESS_TOKEN
 * and drops the provider response, so `invalid_grant` is only visible here.
 */
type RefreshOutcome = { oauthError: string | null }

const refreshOutcome = new AsyncLocalStorage<RefreshOutcome>()

export class InvalidGrantError extends Error {
  constructor() {
    super('Google refresh token was rejected.')
    this.name = 'InvalidGrantError'
  }
}

const oauthErrorCode = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('error' in error)) return null
  const code = (error as { error: unknown }).error
  return typeof code === 'string' ? code : null
}

const noteGoogleOAuthError = (error: unknown) => {
  const outcome = refreshOutcome.getStore()
  const code = oauthErrorCode(error)
  if (outcome && code) outcome.oauthError = code
}

export const refreshGoogleAccessToken = async (refreshToken: string) => {
  try {
    return await refreshAccessToken({
      refreshToken,
      options: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      tokenEndpoint: GOOGLE_TOKEN_URL,
    })
  } catch (error) {
    noteGoogleOAuthError(error)
    throw error
  }
}

export const callObservingTokenRefresh = async <T>(fn: () => Promise<T>): Promise<T> => {
  const outcome: RefreshOutcome = { oauthError: null }
  try {
    return await refreshOutcome.run(outcome, fn)
  } catch (error) {
    if (outcome.oauthError === 'invalid_grant') throw new InvalidGrantError()
    throw error
  }
}
