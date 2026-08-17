import {lukas} from '@/content/team/lukas'
import {getFreeSlots} from '@/lib/google-calendar/get-free-slots'
import {tz} from '@date-fns/tz'
import {differenceInCalendarDays} from 'date-fns'
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
  if (!response || response?.freeSlots.length === 0) return NextResponse.json({availability: ''})

  const timezone = tz(config.timezone)
  const firstSlot = response.freeSlots[0]
  const daysUntilFirstSlot = differenceInCalendarDays(firstSlot.start, timezone(Date.now()), {in: timezone})

  if (daysUntilFirstSlot === 1) return NextResponse.json({availability: 'Morgen verfügbar'})
  if (daysUntilFirstSlot > 1 && daysUntilFirstSlot <= 7) {
    const weekday = new Intl.DateTimeFormat('de-DE', {weekday: 'long', timeZone: config.timezone}).format(firstSlot.start)
    return NextResponse.json({availability: `${weekday} verfügbar`})
  }
  return NextResponse.json({availability: ''})
}
