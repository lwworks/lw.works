import {queryFreeBusy} from '@/lib/google-calendar/query-freebusy'
import {tz} from '@date-fns/tz'
import {addDays, addHours, addMinutes, differenceInMinutes, formatISO, set, startOfDay} from 'date-fns'

const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

export const getFreeSlots = async (config: BookingConfig): Promise<{freeSlots: BookingSlot[]}> => {
  const timezone = tz(config.timezone)
  const now = timezone(Date.now())
  const startDate = addHours(now, config.hoursInAdvance, {in: timezone})
  const endDate = addDays(now, config.daysInAdvance, {in: timezone})

  const busySlots = (await queryFreeBusy(config, formatISO(startDate), formatISO(endDate))).sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime() || new Date(a.end).getTime() - new Date(b.end).getTime()
  )

  // Calculate free slots inbetween, padding busy slots by the break duration
  const freeSlots: BookingSlot[] = []
  let cursor = startDate
  for (const busySlot of busySlots) {
    const slot = {
      start: addMinutes(timezone(new Date(busySlot.start)), -config.breakDuration, {in: timezone}),
      end: addMinutes(timezone(new Date(busySlot.end)), config.breakDuration, {in: timezone})
    }
    if (slot.end <= cursor || slot.start >= endDate) continue
    const start = slot.start < cursor ? cursor : slot.start
    if (start > cursor) freeSlots.push({start: cursor, end: start})
    if (slot.end > cursor) cursor = slot.end
  }
  if (cursor < endDate) freeSlots.push({start: cursor, end: endDate})

  // Intersect free slots with available hours
  const availableSlots: BookingSlot[] = []
  for (const slot of freeSlots) {
    let day = startOfDay(slot.start, {in: timezone})
    while (day < slot.end) {
      const hours = config.availableHours[weekdays[day.getDay()]]
      if (hours) {
        const windowStart = set(day, {hours: Math.floor(hours.start), minutes: (hours.start % 1) * 60, seconds: 0, milliseconds: 0}, {in: timezone})
        const windowEnd = set(day, {hours: Math.floor(hours.end), minutes: (hours.end % 1) * 60, seconds: 0, milliseconds: 0}, {in: timezone})
        const start = slot.start > windowStart ? slot.start : windowStart
        const end = slot.end < windowEnd ? slot.end : windowEnd
        // Only keep windows long enough to fit at least one booking
        if (start < end && differenceInMinutes(end, start) >= config.slotDuration) {
          availableSlots.push({start, end})
        }
      }
      day = addDays(day, 1, {in: timezone})
    }
  }

  // Split available slots into chunks of config.slotDuration
  const bookableSlots: BookingSlot[] = []
  for (const slot of availableSlots) {
    let start = slot.start
    while (true) {
      const end = addMinutes(start, config.slotDuration, {in: timezone})
      if (end > slot.end) break
      bookableSlots.push({start, end})
      start = end
    }
  }

  return {freeSlots: bookableSlots}
}
