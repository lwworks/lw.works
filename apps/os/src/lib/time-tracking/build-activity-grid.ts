import { isoWeekOf, mondayOf, type IsoWeek } from '@/lib/iso-week/iso-week'
import { getActivityLevel, type ActivityLevel } from '@/lib/time-tracking/get-activity-level'
import { shiftDateKey } from '@/lib/time-tracking/shift-date-key'

export type ActivityDay = { date: string; ms: number; level: ActivityLevel }
/** One ISO week, Monday to Sunday; `null` for days outside the chart's range. */
export type ActivityWeek = { week: IsoWeek; days: (ActivityDay | null)[] }
export type ActivityGrid = {
  /** First and last day shown (`YYYY-MM-DD`). */
  from: string
  to: string
  weeks: ActivityWeek[]
  /** Month labels and the index of the week column in which the month's first shown day lies. */
  months: { label: string; column: number }[]
}

const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

/** Week columns for the days `from` to `to` (inclusive, `YYYY-MM-DD`) with each day's tracked time from `trackedMs`. */
export const buildActivityGrid = ({ from, to, trackedMs }: { from: string; to: string; trackedMs: ReadonlyMap<string, number> }): ActivityGrid => {
  const weeks: ActivityWeek[] = []
  const months: ActivityGrid['months'] = []
  const firstMonday = new Date(mondayOf(isoWeekOf(Date.parse(from)))).toISOString().slice(0, 10)

  for (let monday = firstMonday; monday <= to; monday = shiftDateKey(monday, 7)) {
    const days = Array.from({ length: 7 }, (_, index): ActivityDay | null => {
      const date = shiftDateKey(monday, index)
      if (date < from || date > to) return null
      const ms = trackedMs.get(date) ?? 0
      return { date, ms, level: getActivityLevel(ms) }
    })
    const monthStart = days.find((day) => day && (day.date === from || day.date.endsWith('-01')))
    if (monthStart) months.push({ label: MONTHS[Number(monthStart.date.slice(5, 7)) - 1], column: weeks.length })
    weeks.push({ week: isoWeekOf(Date.parse(monday)), days })
  }

  return { from, to, weeks, months }
}
