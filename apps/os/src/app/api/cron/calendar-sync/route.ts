import { isCronRequest } from '@/lib/auth/is-cron-request'
import { syncAllCalendars } from '@/lib/google-calendar/sync-all-calendars'
import { NextResponse } from 'next/server'

export const maxDuration = 300

export async function GET(request: Request) {
  if (!isCronRequest(request)) return new NextResponse('Unauthorized.', { status: 401 })

  // Stop starting new calendars once fewer than 15 s of maxDuration remain.
  const summary = await syncAllCalendars(new Date(Date.now() + (maxDuration - 15) * 1000))
  console.log('Calendar sync finished:', summary)
  return NextResponse.json({ ok: true, ...summary })
}
