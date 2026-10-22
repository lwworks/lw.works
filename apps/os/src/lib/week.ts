export const TIME_ZONE = 'Europe/Berlin'

const DAY_MS = 24 * 60 * 60 * 1000
const WEEK_MS = 7 * DAY_MS

export type IsoWeek = { year: number; week: number }

const dateKeyFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE })
const offsetFormat = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, timeZoneName: 'longOffset' })

/** Calendar date in Europe/Berlin as `YYYY-MM-DD`. */
export const toZonedDateKey = (date: Date) => dateKeyFormat.format(date)

// Berlin switches DST at 01:00 UTC, so the offset at UTC midnight equals the offset at local midnight.
const zonedMidnight = (utcMidnight: number) => {
  const offsetHours = Number(offsetFormat.format(utcMidnight).match(/GMT([+-]\d{2})/)?.[1] ?? 0)
  return new Date(utcMidnight - offsetHours * 60 * 60 * 1000)
}

const mondayIndex = (utcMidnight: number) => (new Date(utcMidnight).getUTCDay() + 6) % 7

const firstMonday = (year: number) => {
  const jan4 = Date.UTC(year, 0, 4)
  return jan4 - mondayIndex(jan4) * DAY_MS
}

const mondayOf = ({ year, week }: IsoWeek) => firstMonday(year) + (week - 1) * WEEK_MS

const isoWeekOf = (utcMidnight: number): IsoWeek => {
  const thursday = utcMidnight + (3 - mondayIndex(utcMidnight)) * DAY_MS
  const year = new Date(thursday).getUTCFullYear()
  return { year, week: 1 + Math.floor((thursday - firstMonday(year)) / WEEK_MS) }
}

export const getCurrentIsoWeek = (now = new Date()) => isoWeekOf(Date.parse(toZonedDateKey(now)))

export const formatIsoWeek = ({ year, week }: IsoWeek) => `${year}-W${String(week).padStart(2, '0')}`

export const parseIsoWeek = (value: string | undefined): IsoWeek | null => {
  const match = value?.match(/^(\d{4})-W(\d{2})$/)
  if (!match) return null
  const week = { year: Number(match[1]), week: Number(match[2]) }
  return week.week >= 1 && formatIsoWeek(isoWeekOf(mondayOf(week))) === formatIsoWeek(week) ? week : null
}

export const shiftIsoWeek = (week: IsoWeek, delta: number) => isoWeekOf(mondayOf(week) + delta * WEEK_MS)

/** Monday 00:00 to next Monday 00:00 in Europe/Berlin. */
export const getIsoWeekRange = (week: IsoWeek) => ({
  start: zonedMidnight(mondayOf(week)),
  end: zonedMidnight(mondayOf(week) + WEEK_MS),
})
