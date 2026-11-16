import { isCronRequest } from '@/lib/auth/is-cron-request'
import { syncSevdesk } from '@/lib/sevdesk/sync-sevdesk'
import { NextResponse } from 'next/server'

export const maxDuration = 120

export async function GET(request: Request) {
  if (!isCronRequest(request)) return new NextResponse('Unauthorized.', { status: 401 })

  const result = await syncSevdesk()
  console.log('SevDesk sync finished:', result)
  return NextResponse.json(result, { status: result.status === 'error' ? 500 : 200 })
}
