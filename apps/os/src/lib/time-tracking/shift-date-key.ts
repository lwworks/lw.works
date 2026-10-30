import { DAY_MS } from '@/lib/iso-week/iso-week'

/** The `YYYY-MM-DD` date `days` calendar days after (or before) `date`. */
export const shiftDateKey = (date: string, days: number) => new Date(Date.parse(date) + days * DAY_MS).toISOString().slice(0, 10)
