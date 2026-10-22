import { syncAllCalendars } from '@/lib/google-calendar/sync'
import { timingSafeEqual } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300

const isAuthorized = (authorization: string | null) => {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const provided = Buffer.from(authorization ?? '')
  return expected.length === provided.length && timingSafeEqual(expected, provided)
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request.headers.get('Authorization'))) return new NextResponse('Unauthorized.', { status: 401 })

  // Stop starting new calendars once fewer than 15 s of maxDuration remain.
  const summary = await syncAllCalendars(new Date(Date.now() + (maxDuration - 15) * 1000))
  console.log('Calendar sync finished:', summary)
  return NextResponse.json({ ok: true, ...summary })
}
