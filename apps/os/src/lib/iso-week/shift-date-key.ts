import { DAY_MS } from '@/lib/iso-week/iso-week'
import { toDateKey } from '@/lib/iso-week/to-date-key'

/** The `YYYY-MM-DD` date `days` calendar days after (or before) `date`. */
export const shiftDateKey = (date: string, days: number) => toDateKey(Date.parse(date) + days * DAY_MS)
