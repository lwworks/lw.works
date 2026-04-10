import {loadTeamMemberContent} from '@/content/contact'
import {getAvailableSlots} from '@/lib/google-calendar'
import {NextResponse} from 'next/server'

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const memberSlug = searchParams.get('member')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  if (!memberSlug || !from || !to) {
    return NextResponse.json({error: 'Missing parameters'}, {status: 400})
  }

  const content = await loadTeamMemberContent(memberSlug, 'de')
  if (!content) {
    return NextResponse.json({error: 'Member not found'}, {status: 404})
  }

  const slots = await getAvailableSlots(from, to, content.calendar.booking)
  const minimumLeadTime = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const filteredSlots = slots
    .map((day) => ({
      ...day,
      slots: day.slots.filter((slot) => new Date(slot.start) >= minimumLeadTime)
    }))

  return NextResponse.json(filteredSlots)
}
