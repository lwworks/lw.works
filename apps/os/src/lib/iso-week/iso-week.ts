export type IsoWeek = { year: number; week: number }

export const DAY_MS = 24 * 60 * 60 * 1000
export const WEEK_MS = 7 * DAY_MS

const mondayIndex = (utcMidnight: number) => (new Date(utcMidnight).getUTCDay() + 6) % 7

const firstMonday = (year: number) => {
  const jan4 = Date.UTC(year, 0, 4)
  return jan4 - mondayIndex(jan4) * DAY_MS
}

/** UTC midnight of the week's Monday. */
export const mondayOf = ({ year, week }: IsoWeek) => firstMonday(year) + (week - 1) * WEEK_MS

/** ISO week containing the given UTC-midnight date. */
export const isoWeekOf = (utcMidnight: number): IsoWeek => {
  const thursday = utcMidnight + (3 - mondayIndex(utcMidnight)) * DAY_MS
  const year = new Date(thursday).getUTCFullYear()
  return { year, week: 1 + Math.floor((thursday - firstMonday(year)) / WEEK_MS) }
}

export const formatIsoWeek = ({ year, week }: IsoWeek) => `${year}-W${String(week).padStart(2, '0')}`

export const parseIsoWeek = (value: string | undefined): IsoWeek | null => {
  const match = value?.match(/^(\d{4})-W(\d{2})$/)
  if (!match) return null
  const week = { year: Number(match[1]), week: Number(match[2]) }
  return week.week >= 1 && formatIsoWeek(isoWeekOf(mondayOf(week))) === formatIsoWeek(week) ? week : null
}

export const shiftIsoWeek = (week: IsoWeek, delta: number) => isoWeekOf(mondayOf(week) + delta * WEEK_MS)
