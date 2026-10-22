import { TIME_ZONE } from '@/lib/week'

const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, ...options }).format

export const formatTime = format({ hour: '2-digit', minute: '2-digit' })
export const formatDay = format({ weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
export const formatShortDate = format({ day: '2-digit', month: '2-digit' })
export const formatDate = format({ day: '2-digit', month: '2-digit', year: 'numeric' })
export const formatDateTime = format({ dateStyle: 'medium', timeStyle: 'short' })

export const formatDuration = (ms: number) => {
  const totalMinutes = Math.max(0, Math.round(ms / 60000))
  return `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, '0')} h`
}

/** Running events count up to `now`. */
export const sumTrackedMs = (entries: { startAt: Date; endAt: Date }[], now: Date) =>
  entries.reduce((sum, { startAt, endAt }) => sum + Math.max(0, Math.min(endAt.getTime(), now.getTime()) - startAt.getTime()), 0)
