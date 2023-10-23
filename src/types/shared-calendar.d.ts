type SharedCalendar = {
  alias: string
  id: string
  title: string
  description: string
  eventMinDurationMinutes: number
  eventMaxDurationMinutes: number
  location: string
  slots: CalendarSlot[]
  __typename: string
}
