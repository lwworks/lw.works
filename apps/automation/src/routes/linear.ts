import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'

import { handleWebhook } from '../lib/linear-agent/handle-webhook.js'

export const linear = new Hono()

linear.post('/agent', async (c) => {
  const status = await handleWebhook(c.req.raw, (work) => waitUntil(work()))
  return new Response(null, { status })
})
