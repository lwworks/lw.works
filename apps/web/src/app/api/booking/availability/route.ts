import {bookingConfigs} from '@/lib/booking-configs'
import {getFreeSlots} from '@/lib/google-calendar/get-free-slots'
import {tz} from '@date-fns/tz'
import {differenceInCalendarDays} from 'date-fns'
import {NextResponse} from 'next/server'

/**
 * Returns a short German availability label for the next free booking slot.
 *
 * Used by the booking UI (`useAvailability`) to show when the next slot
 * is available, without listing every slot. Looks up Google Calendar
 * free/busy for the given booking type.
 *
 * Query parameters:
 * - `type` — booking config key (e.g. `check` or `bni`)
 *
 * @param request - Incoming GET with the query parameters above.
 * @returns JSON `{availability}` with `"Morgen verfügbar"`,
 *   `"<weekday> verfügbar"` (within 7 days), or `""` if none;
 *   `400` missing type, `404` unknown type.
 */

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const type = searchParams.get('type')

  if (!type) return NextResponse.json({error: 'Missing type'}, {status: 400})

  const config = bookingConfigs[type as keyof typeof bookingConfigs]
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
