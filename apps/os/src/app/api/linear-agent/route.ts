import { after } from 'next/server'

import { handleWebhook } from '@/lib/linear-agent/handle-webhook'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: Request) {
  return new Response(null, { status: await handleWebhook(request, after) })
}
