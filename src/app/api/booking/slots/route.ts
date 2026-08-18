import {lukas} from '@/content/team/lukas'
import {getFreeSlots} from '@/lib/google-calendar/get-free-slots'
import {groupSlotsByDay} from '@/lib/google-calendar/group-slots-by-day'
import {NextResponse} from 'next/server'

const configs = {
  check: lukas.bookingOptions.check
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const type = searchParams.get('type')

  if (!type) return NextResponse.json({error: 'Missing type'}, {status: 400})

  const config = configs[type as keyof typeof configs]
  if (!config) return NextResponse.json({error: 'Wrong type'}, {status: 404})

  const response = await getFreeSlots(config)
  if (!response || response.freeSlots.length === 0) return NextResponse.json({slots: {}})

  return NextResponse.json({slots: groupSlotsByDay(response.freeSlots, config.timezone)})
}
