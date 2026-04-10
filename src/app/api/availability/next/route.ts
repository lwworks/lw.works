import { loadTeamMemberContent } from '@/content/contact'
import { getAvailableSlots } from '@/lib/google-calendar'
import { type Locale } from '@/i18n/locale'
import { NextResponse } from 'next/server'

const MAX_LOOKAHEAD_DAYS = 30

type NextAvailabilityResponse = {
  nextStart: string | null
  timezone: string | null
}

function formatDateOnly(date: Date): string {
  return date.toISOString().split('T')[0]
}

function parseLocale(raw: string | null): Locale {
  return raw === 'en' ? 'en' : 'de'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const memberSlug = searchParams.get('member')
  const locale = parseLocale(searchParams.get('locale'))

  if (!memberSlug) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const content = await loadTeamMemberContent(memberSlug, locale)
  if (!content) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  const now = new Date()
  const from = new Date(now)
  const to = new Date(now)
  to.setDate(to.getDate() + Math.min(content.calendar.booking.advanceDays, MAX_LOOKAHEAD_DAYS))

  const days = await getAvailableSlots(
    formatDateOnly(from),
    formatDateOnly(to),
    content.calendar.booking
  )

  const nextSlot = days.flatMap((day) => day.slots).sort((a, b) => a.start.localeCompare(b.start))[0]
  const response: NextAvailabilityResponse = {
    nextStart: nextSlot?.start ?? null,
    timezone: content.calendar.booking.timezone
  }

  return NextResponse.json(response)
}
