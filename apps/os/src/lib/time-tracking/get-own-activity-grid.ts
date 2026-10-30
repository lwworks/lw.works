import 'server-only'

import { getOwnDailyTrackedMs } from '@/lib/db/time-entries/get-own-daily-tracked-ms'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'
import { zonedMidnight } from '@/lib/iso-week/zoned-midnight'
import { buildActivityGrid } from '@/lib/time-tracking/build-activity-grid'
import { shiftDateKey } from '@/lib/time-tracking/shift-date-key'
import { TRACKING_START_DATE } from '@/lib/time-tracking/tracking-start-date'

/** The signed-in user's activity chart from the start of time tracking to today (Europe/Berlin). */
export const getOwnActivityGrid = async (now: Date) => {
  const today = toZonedDateKey(now)
  const rows = await getOwnDailyTrackedMs({
    start: zonedMidnight(Date.parse(TRACKING_START_DATE)),
    end: zonedMidnight(Date.parse(shiftDateKey(today, 1))),
    now,
  })
  return buildActivityGrid({ from: TRACKING_START_DATE, to: today, trackedMs: new Map(rows.map(({ date, ms }) => [date, ms])) })
}
