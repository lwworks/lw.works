import { TIME_ZONE } from '@/lib/week'

const timeFormat = new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
const shortDateFormat = new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit' })
const dateFormat = new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', year: 'numeric' })
const dateTimeFormat = new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, dateStyle: 'medium', timeStyle: 'short' })

export const formatTime = (date: Date) => timeFormat.format(date)
export const formatDay = (date: Date) => dayFormat.format(date)
export const formatShortDate = (date: Date) => shortDateFormat.format(date)
export const formatDate = (date: Date) => dateFormat.format(date)
export const formatDateTime = (date: Date) => dateTimeFormat.format(date)

export const formatDuration = (ms: number) => {
  const totalMinutes = Math.max(0, Math.round(ms / 60000))
  return `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, '0')} h`
}

/** Tracked duration; running events count up to `now`. */
export const getTrackedMs = ({ startAt, endAt }: { startAt: Date; endAt: Date }, now: Date) =>
  Math.max(0, Math.min(endAt.getTime(), now.getTime()) - startAt.getTime())
