import 'server-only'

import type { AgentEvent } from './event-schema'

export function buildRoutinePayload(event: AgentEvent) {
  const { agentSession, agentActivity, action } = event
  return {
    source: 'linear-agent-session',
    action,
    organizationId: event.organizationId,
    agentSessionId: agentSession.id,
    issue: agentSession.issue,
    commentId: agentSession.commentId,
    creator: agentSession.creator,
    promptContext: action === 'created' ? event.promptContext : undefined,
    promptBody: action === 'prompted' ? agentActivity?.content?.body : undefined,
    signal: action === 'prompted' ? agentActivity?.signal : undefined,
    webhookTimestamp: event.webhookTimestamp,
  }
}
