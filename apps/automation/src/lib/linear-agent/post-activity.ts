import { z } from 'zod'

import type { RelayConfig } from './get-relay-config'

const tokenResponse = z.object({
  access_token: z.string().min(1),
  expires_in: z.number().positive(),
})
const activityResponse = z.object({
  data: z.object({ agentActivityCreate: z.object({ success: z.literal(true) }) }),
  errors: z.array(z.unknown()).length(0).optional(),
})
let cachedToken: { value: string; expiresAt: number } | undefined

async function getToken(config: RelayConfig, signal: AbortSignal) {
  if (cachedToken && cachedToken.expiresAt - Date.now() > 60_000) return cachedToken

  const credentials = Buffer.from(`${config.LINEAR_CLIENT_ID}:${config.LINEAR_CLIENT_SECRET}`).toString('base64')
  const response = await fetch('https://api.linear.app/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials', scope: config.LINEAR_SCOPES }),
    signal,
    redirect: 'error',
  })
  if (!response.ok) throw new Error(`Linear token request returned ${response.status}`)

  const result = tokenResponse.safeParse(await response.json())
  if (!result.success) throw new Error('Invalid Linear token response')

  cachedToken = { value: result.data.access_token, expiresAt: Date.now() + result.data.expires_in * 1000 }
  return cachedToken
}

export async function postActivity(config: RelayConfig, agentSessionId: string, content: {
  type: 'thought' | 'error'
  body: string
}) {
  const signal = AbortSignal.timeout(4_000)
  const token = await getToken(config, signal)
  const response = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'mutation($input: AgentActivityCreateInput!) { agentActivityCreate(input: $input) { success } }',
      variables: { input: { agentSessionId, content } },
    }),
    signal,
    redirect: 'error',
  })
  if (response.status === 401 && cachedToken === token) cachedToken = undefined
  if (!response.ok) throw new Error(`Linear activity request returned ${response.status}`)

  if (!activityResponse.safeParse(await response.json()).success) {
    throw new Error('Linear did not confirm activity creation')
  }
}
