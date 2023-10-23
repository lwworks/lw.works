import add from 'date-fns/add'

export const getDividedSlots = (slot: CalendarSlot, durationInMinutes: number): CalendarSlot[] => {
  let slots = []
  let slotStart = slot.startAt
  let slotEnd = add(slotStart, {minutes: durationInMinutes})

  while (slot.endAt.getTime() >= slotEnd.getTime()) {
    slots.push({startAt: slotStart, endAt: slotEnd})
    slotStart = add(slotEnd, {minutes: 15})
    slotEnd = add(slotStart, {minutes: durationInMinutes})
  }
  return slots
}
