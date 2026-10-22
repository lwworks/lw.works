import type { SyncRange } from '@/lib/google-calendar/sync-calendar-state'
import { SYNC_START } from '@/lib/google-calendar/to-time-entry-values'
import { zonedMidnight } from '@/lib/iso-week/zoned-midnight'

const DAY_MS = 24 * 60 * 60 * 1000

const parseDateKey = (value: string) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? Date.parse(value) : NaN)

/**
 * Turns picked calendar days (`YYYY-MM-DD`, inclusive, Europe/Berlin) into a sync range clamped to
 * SYNC_START … now. Returns `null` for malformed input or a range that is empty after clamping.
 */
export const parseSyncRange = ({ from, to }: { from: string; to: string }, now: Date): SyncRange | null => {
  const fromDay = parseDateKey(from)
  const toDay = parseDateKey(to)
  if (Number.isNaN(fromDay) || Number.isNaN(toDay)) return null

  const range = {
    from: new Date(Math.max(zonedMidnight(fromDay).getTime(), SYNC_START.getTime())),
    to: new Date(Math.min(zonedMidnight(toDay + DAY_MS).getTime(), now.getTime())),
  }
  return range.from < range.to ? range : null
}
