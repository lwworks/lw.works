import { isoWeekOf, mondayOf, type IsoWeek } from '@/lib/iso-week/iso-week'
import { shiftDateKey } from '@/lib/iso-week/shift-date-key'
import { toDateKey } from '@/lib/iso-week/to-date-key'
import { getActivityLevel, type ActivityLevel } from '@/lib/time-tracking/get-activity-level'

export type ActivityDay = { date: string; ms: number; level: ActivityLevel }
/** One ISO week, Monday to Sunday; `null` for days outside the chart's range. */
export type ActivityWeek = { week: IsoWeek; days: (ActivityDay | null)[] }
export type ActivityGrid = {
  /** First and last day shown (`YYYY-MM-DD`). */
  from: string
  to: string
  /** Last day that can be opened (`YYYY-MM-DD`). Later days are shown but are not links. */
  today: string
  weeks: ActivityWeek[]
  /** 1-based month and the week column of its first shown day. A column keeps one label, the later month. */
  months: { month: number; column: number }[]
}

/** Week columns for the days `from` to `to` (inclusive, `YYYY-MM-DD`) with each day's tracked time from `trackedMs`. */
export const buildActivityGrid = ({
  from,
  to,
  today,
  trackedMs,
}: {
  from: string
  to: string
  today: string
  trackedMs: ReadonlyMap<string, number>
}): ActivityGrid => {
  const weeks: ActivityWeek[] = []
  const months: ActivityGrid['months'] = []
  const firstMonday = toDateKey(mondayOf(isoWeekOf(Date.parse(from))))
  let monthKey = ''

  for (let monday = firstMonday; monday <= to; monday = shiftDateKey(monday, 7)) {
    const days = Array.from({ length: 7 }, (_, index): ActivityDay | null => {
      const date = shiftDateKey(monday, index)
      if (date < from || date > to) return null
      const ms = trackedMs.get(date) ?? 0
      return { date, ms, level: getActivityLevel(ms) }
    })
    for (const day of days) {
      if (!day) continue
      const key = day.date.slice(0, 7)
      if (key === monthKey) continue
      monthKey = key
      const column = weeks.length
      const month = Number(day.date.slice(5, 7))
      const last = months.at(-1)
      if (last?.column === column) last.month = month
      else months.push({ month, column })
    }
    weeks.push({ week: isoWeekOf(Date.parse(monday)), days })
  }

  return { from, to, today, weeks, months }
}
