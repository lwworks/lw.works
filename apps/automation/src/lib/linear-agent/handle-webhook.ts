import { z } from 'zod'

import { eventSchema } from './event-schema'
import { getRelayConfig } from './get-relay-config'
import { relayEvent } from './relay-event'
import { verifySignature } from './verify-signature'

const envelopeSchema = z.object({
  type: z.string(),
  action: z.string(),
  webhookTimestamp: z.unknown().optional(),
})

export async function handleWebhook(request: Request, schedule: (work: () => Promise<void>) => void) {
  const config = getRelayConfig()
  if (!config) return 500

  const body = Buffer.from(await request.arrayBuffer())
  if (!verifySignature(body, request.headers.get('linear-signature'), config.LINEAR_WEBHOOK_SECRET)) return 401

  let payload: unknown
  try {
    payload = JSON.parse(body.toString('utf8'))
  } catch {
    return 400
  }

  const envelope = envelopeSchema.safeParse(payload)
  if (!envelope.success) return 400

  const { type, action, webhookTimestamp } = envelope.data
  if (typeof webhookTimestamp !== 'number' || !Number.isFinite(webhookTimestamp)
      || Math.abs(Date.now() - webhookTimestamp) > 60_000) return 401
  if (type !== 'AgentSessionEvent' || (action !== 'created' && action !== 'prompted')) return 200

  const event = eventSchema.safeParse(payload)
  if (!event.success) return 400

  schedule(() => relayEvent(event.data, config))
  return 200
}
