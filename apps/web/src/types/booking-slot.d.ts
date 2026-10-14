type BookingSlot = {
  start: TZDate
  end: TZDate
}

type BookingSlotsByDay = Record<string, BookingSlot[]>
