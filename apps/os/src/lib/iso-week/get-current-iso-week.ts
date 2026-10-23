import { isoWeekOf } from '@/lib/iso-week/iso-week'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'

export const getCurrentIsoWeek = (now = new Date()) => isoWeekOf(Date.parse(toZonedDateKey(now)))
