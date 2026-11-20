import { buildRoutinePayload } from './build-routine-payload.js'
import type { AgentEvent } from './event-schema.js'
import type { RelayConfig } from './get-relay-config.js'
import { postActivity } from './post-activity.js'

export async function relayEvent(event: AgentEvent, config: RelayConfig) {
  const { id } = event.agentSession
  const actor = event.action === 'created' ? event.agentSession.creator : event.agentActivity?.user
  const allowed = actor?.email && config.ALLOWED_EMAILS.includes(actor.email.toLowerCase())

  try {
    if (!allowed) {
      await postActivity(config, id, { type: 'error', body: 'Atlas nimmt Aufträge nur von freigegebenen Personen an.' })
      return
    }

    await postActivity(config, id, { type: 'thought', body: 'Atlas schaut sich das an …' })
    const response = await fetch(config.ROUTINE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.ROUTINE_WEBHOOK_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildRoutinePayload(event)),
      signal: AbortSignal.timeout(8_000),
      redirect: 'error',
    })
    if (!response.ok) throw new Error(`Routine returned ${response.status}`)
  } catch (error) {
    // Log only the error class. Fetch and JSON parsing errors can include request or response details.
    console.error('Linear agent relay: delivery failed', error instanceof Error ? error.name : undefined)
    if (!allowed) return

    try {
      await postActivity(config, id, { type: 'error', body: 'Atlas konnte nicht gestartet werden.' })
    } catch {
      console.error('Linear agent relay: could not post error activity')
    }
  }
}
