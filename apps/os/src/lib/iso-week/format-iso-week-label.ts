import { formatDate, formatShortDate } from '@/lib/format/format-date-time'
import { getIsoWeekRange } from '@/lib/iso-week/get-iso-week-range'
import type { IsoWeek } from '@/lib/iso-week/iso-week'

/** `KW 43 · 19.10.–25.10.2026` (Monday to Sunday, Europe/Berlin). */
export const formatIsoWeekLabel = (week: IsoWeek) => {
  const { start, end } = getIsoWeekRange(week)
  return `KW ${week.week} · ${formatShortDate(start)}–${formatDate(new Date(end.getTime() - 1))}`
}
