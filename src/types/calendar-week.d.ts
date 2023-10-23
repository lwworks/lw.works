type CalendarWeek = {
  week: number
  days: {
    slug: string
    date: Date
    dayOfMonth: number
    month: string
    year: string
    weekday: string
    slots: CalendarSlot[]
  }[]
}
