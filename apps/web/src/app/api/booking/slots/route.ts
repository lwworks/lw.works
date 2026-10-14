import {bookingConfigs} from '@/lib/booking-configs'
import {getFreeSlots} from '@/lib/google-calendar/get-free-slots'
import {groupSlotsByDay} from '@/lib/google-calendar/group-slots-by-day'
import {NextResponse} from 'next/server'

/**
 * Returns free booking slots grouped by day for the given booking type.
 *
 * Used by the booking UI (`useSlots`) to render the slot picker. Looks up
 * Google Calendar free/busy for the matching booking config, then groups
 * slots by local date.
 *
 * Query parameters:
 * - `type` — booking config key (e.g. `check` or `bni`)
 *
 * @param request - Incoming GET with the query parameters above.
 * @returns JSON `{slots}` keyed by date, or `{slots: {}}` if none;
 *   `400` missing type, `404` unknown type.
 */

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const type = searchParams.get('type')

  if (!type) return NextResponse.json({error: 'Missing type'}, {status: 400})

  const config = bookingConfigs[type as keyof typeof bookingConfigs]
  if (!config) return NextResponse.json({error: 'Wrong type'}, {status: 404})

  const response = await getFreeSlots(config)
  if (!response || response.freeSlots.length === 0) return NextResponse.json({slots: {}})

  const slots = groupSlotsByDay(response.freeSlots, config.timezone)
  return NextResponse.json({slots})
}
