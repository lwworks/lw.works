import {tz} from '@date-fns/tz'
import {format} from 'date-fns'

export const groupSlotsByDay = (slots: BookingSlot[], timezone: string): BookingSlotsByDay => {
  const inTimezone = tz(timezone)
  const grouped: BookingSlotsByDay = {}

  for (const slot of slots) {
    const day = format(slot.start, 'yyyy-MM-dd', {in: inTimezone})
    grouped[day] ??= []
    grouped[day].push(slot)
  }

  return grouped
}
