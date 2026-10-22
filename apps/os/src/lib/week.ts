export const TIME_ZONE = 'Europe/Berlin'

const DAY_MS = 24 * 60 * 60 * 1000

export type IsoWeek = { year: number; week: number }

const zonedParts = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})

const getZonedDate = (date: Date) => {
  const parts = Object.fromEntries(zonedParts.formatToParts(date).map((part) => [part.type, Number(part.value)]))
  return { year: parts.year, month: parts.month, day: parts.day, hour: parts.hour, minute: parts.minute, second: parts.second }
}

const getZoneOffsetMs = (date: Date) => {
  const zoned = getZonedDate(date)
  const asUtc = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute, zoned.second)
  return asUtc - Math.floor(date.getTime() / 1000) * 1000
}

/** Midnight in Europe/Berlin of the given calendar date (month is 1-based). */
export const zonedMidnight = (year: number, month: number, day: number) => {
  const guess = Date.UTC(year, month - 1, day)
  const offset = getZoneOffsetMs(new Date(guess - getZoneOffsetMs(new Date(guess))))
  return new Date(guess - offset)
}

/** Calendar date in Europe/Berlin as `YYYY-MM-DD`. */
export const toZonedDateKey = (date: Date) => {
  const { year, month, day } = getZonedDate(date)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const isoWeekOfUtcDate = (utcMidnight: number): IsoWeek => {
  const dayOfWeek = (new Date(utcMidnight).getUTCDay() + 6) % 7
  const thursday = new Date(utcMidnight + (3 - dayOfWeek) * DAY_MS)
  const year = thursday.getUTCFullYear()
  const jan4 = Date.UTC(year, 0, 4)
  const firstThursday = jan4 + (3 - ((new Date(jan4).getUTCDay() + 6) % 7)) * DAY_MS
  return { year, week: 1 + Math.round((thursday.getTime() - firstThursday) / (7 * DAY_MS)) }
}

const mondayOfIsoWeek = ({ year, week }: IsoWeek) => {
  const jan4 = Date.UTC(year, 0, 4)
  return jan4 - ((new Date(jan4).getUTCDay() + 6) % 7) * DAY_MS + (week - 1) * 7 * DAY_MS
}

export const getCurrentIsoWeek = (now = new Date()) => {
  const { year, month, day } = getZonedDate(now)
  return isoWeekOfUtcDate(Date.UTC(year, month - 1, day))
}

export const formatIsoWeek = ({ year, week }: IsoWeek) => `${year}-W${String(week).padStart(2, '0')}`

export const parseIsoWeek = (value: string | undefined): IsoWeek | null => {
  const match = value?.match(/^(\d{4})-W(\d{2})$/)
  if (!match) return null
  const candidate = { year: Number(match[1]), week: Number(match[2]) }
  if (candidate.week < 1) return null
  const roundTrip = isoWeekOfUtcDate(mondayOfIsoWeek(candidate))
  return roundTrip.year === candidate.year && roundTrip.week === candidate.week ? candidate : null
}

export const shiftIsoWeek = (week: IsoWeek, delta: number) => isoWeekOfUtcDate(mondayOfIsoWeek(week) + delta * 7 * DAY_MS)

/** Week boundaries as instants (Monday 00:00 to next Monday 00:00, Europe/Berlin) plus the seven day keys. */
export const getIsoWeekRange = (week: IsoWeek) => {
  const monday = mondayOfIsoWeek(week)
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday + index * DAY_MS)
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() }
  })
  const nextMonday = new Date(monday + 7 * DAY_MS)
  return {
    start: zonedMidnight(days[0].year, days[0].month, days[0].day),
    end: zonedMidnight(nextMonday.getUTCFullYear(), nextMonday.getUTCMonth() + 1, nextMonday.getUTCDate()),
    dayKeys: days.map(({ year, month, day }) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`),
  }
}
