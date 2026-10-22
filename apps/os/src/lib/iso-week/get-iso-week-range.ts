import { mondayOf, WEEK_MS, type IsoWeek } from '@/lib/iso-week/iso-week'
import { TIME_ZONE } from '@/lib/iso-week/to-zoned-date-key'

const offsetFormat = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, timeZoneName: 'longOffset' })

// Berlin switches DST at 01:00 UTC, so the offset at UTC midnight equals the offset at local midnight.
const zonedMidnight = (utcMidnight: number) => {
  const offsetHours = Number(offsetFormat.format(utcMidnight).match(/GMT([+-]\d{2})/)?.[1] ?? 0)
  return new Date(utcMidnight - offsetHours * 60 * 60 * 1000)
}

/** Monday 00:00 to next Monday 00:00 in Europe/Berlin. */
export const getIsoWeekRange = (week: IsoWeek) => ({
  start: zonedMidnight(mondayOf(week)),
  end: zonedMidnight(mondayOf(week) + WEEK_MS),
})
