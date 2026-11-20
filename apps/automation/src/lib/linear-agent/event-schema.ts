import { z } from 'zod'

const user = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().nullish(),
})

export const eventSchema = z.object({
  action: z.enum(['created', 'prompted']),
  webhookTimestamp: z.number(),
  organizationId: z.string().min(1),
  agentSession: z.object({
    id: z.string().min(1),
    creator: user.nullish(),
    commentId: z.string().nullish(),
    issue: z.object({
      id: z.string(),
      identifier: z.string(),
      title: z.string(),
      url: z.string(),
    }).nullish(),
  }),
  promptContext: z.string().nullish(),
  agentActivity: z.object({
    user: user.nullish(),
    content: z.object({ body: z.string().optional() }).nullish(),
    signal: z.string().nullish(),
  }).nullish(),
})

export type AgentEvent = z.infer<typeof eventSchema>
