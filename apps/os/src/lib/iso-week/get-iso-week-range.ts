import { mondayOf, WEEK_MS, type IsoWeek } from '@/lib/iso-week/iso-week'
import { zonedMidnight } from '@/lib/iso-week/zoned-midnight'

/** Monday 00:00 to next Monday 00:00 in Europe/Berlin. */
export const getIsoWeekRange = (week: IsoWeek) => ({
  start: zonedMidnight(mondayOf(week)),
  end: zonedMidnight(mondayOf(week) + WEEK_MS),
})
