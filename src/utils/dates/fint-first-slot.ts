export const findFirstSlot = (weeks: CalendarWeek[]): {week: number; day: number} => {
  const week = weeks.findIndex((week) => week.days.filter((day) => day.slots.length > 0).length > 0)
  return {
    week,
    day: weeks[week].days.findIndex((day) => day.slots.length > 0)
  }
}
