import { teamMemberBookingConfig } from '@/components/pages/team-member'
import { getAvailableSlots } from '@/lib/google-calendar'
import { NextResponse } from 'next/server'

const MAX_LOOKAHEAD_DAYS = 30

type NextAvailabilityResponse = {
  nextStart: string | null
  timezone: string | null
}

function formatDateOnly(date: Date): string {
  return date.toISOString().split('T')[0]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const memberSlug = searchParams.get('member')

  if (!memberSlug) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  if (memberSlug !== teamMemberBookingConfig.teamMemberSlug) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  const now = new Date()
  const from = new Date(now)
  const to = new Date(now)
  to.setDate(to.getDate() + Math.min(teamMemberBookingConfig.advanceDays, MAX_LOOKAHEAD_DAYS))

  const days = await getAvailableSlots(
    formatDateOnly(from),
    formatDateOnly(to),
    teamMemberBookingConfig,
  )

  const nextSlot = days.flatMap((day) => day.slots).sort((a, b) => a.start.localeCompare(b.start))[0]
  const response: NextAvailabilityResponse = {
    nextStart: nextSlot?.start ?? null,
    timezone: teamMemberBookingConfig.timezone,
  }

  return NextResponse.json(response)
}
