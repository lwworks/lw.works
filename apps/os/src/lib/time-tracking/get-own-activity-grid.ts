import 'server-only'

import { getOwnDailyTrackedMs } from '@/lib/db/time-entries/get-own-daily-tracked-ms'
import { SYNC_START } from '@/lib/google-calendar/to-time-entry-values'
import { shiftDateKey } from '@/lib/iso-week/shift-date-key'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'
import { zonedMidnight } from '@/lib/iso-week/zoned-midnight'
import { buildActivityGrid } from '@/lib/time-tracking/build-activity-grid'

/** The signed-in user's activity chart from the start of time tracking through the end of the current year (Europe/Berlin). */
export const getOwnActivityGrid = async (now: Date) => {
  const today = toZonedDateKey(now)
  const rows = await getOwnDailyTrackedMs({
    start: SYNC_START,
    end: zonedMidnight(Date.parse(shiftDateKey(today, 1))),
    now,
  })
  return buildActivityGrid({
    from: toZonedDateKey(SYNC_START),
    to: `${today.slice(0, 4)}-12-31`,
    today,
    trackedMs: new Map(rows.map(({ date, ms }) => [date, ms])),
  })
}
