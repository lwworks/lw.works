import {bookingConfigs} from '@/lib/booking-configs'
import {getFreeSlots} from '@/lib/google-calendar/get-free-slots'
import {groupSlotsByDay} from '@/lib/google-calendar/group-slots-by-day'
import {NextResponse} from 'next/server'

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const type = searchParams.get('type')

  if (!type) return NextResponse.json({error: 'Missing type'}, {status: 400})

  const config = bookingConfigs[type as keyof typeof bookingConfigs]
  if (!config) return NextResponse.json({error: 'Wrong type'}, {status: 404})

  const response = await getFreeSlots(config)
  if (!response || response.freeSlots.length === 0) return NextResponse.json({slots: {}})

  return NextResponse.json({slots: groupSlotsByDay(response.freeSlots, config.timezone)})
}
