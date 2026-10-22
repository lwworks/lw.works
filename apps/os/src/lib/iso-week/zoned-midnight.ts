import { TIME_ZONE } from '@/lib/iso-week/to-zoned-date-key'

const offsetFormat = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, timeZoneName: 'longOffset' })

/**
 * Midnight in Europe/Berlin of the calendar date whose UTC midnight is given.
 * Berlin switches DST at 01:00 UTC, so the offset at UTC midnight equals the offset at local midnight.
 */
export const zonedMidnight = (utcMidnight: number) => {
  const offsetHours = Number(offsetFormat.format(utcMidnight).match(/GMT([+-]\d{2})/)?.[1] ?? 0)
  return new Date(utcMidnight - offsetHours * 60 * 60 * 1000)
}
