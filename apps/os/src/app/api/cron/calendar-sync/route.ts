import { syncAllCalendars } from '@/lib/google-calendar/sync'
import { timingSafeEqual } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300

const TIME_BUDGET_MS = (maxDuration - 30) * 1000

const isAuthorized = (authorization: string | null, secret: string) => {
  const expected = Buffer.from(`Bearer ${secret}`)
  const provided = Buffer.from(authorization ?? '')
  if (expected.length !== provided.length) return false
  return timingSafeEqual(expected, provided)
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || !isAuthorized(request.headers.get('Authorization'), secret)) return new NextResponse('Unauthorized.', { status: 401 })

  try {
    const summary = await syncAllCalendars(new Date(Date.now() + TIME_BUDGET_MS))
    console.log('Calendar sync finished:', summary)
    return NextResponse.json({ ok: true, ...summary })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal server error.', { status: 500 })
  }
}
