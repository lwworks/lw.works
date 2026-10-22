import { TIME_ZONE } from '@/lib/iso-week/to-zoned-date-key'

const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, ...options }).format

export const formatTime = format({ hour: '2-digit', minute: '2-digit' })
export const formatDay = format({ weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
export const formatShortDate = format({ day: '2-digit', month: '2-digit' })
export const formatDate = format({ day: '2-digit', month: '2-digit', year: 'numeric' })
export const formatDateTime = format({ dateStyle: 'medium', timeStyle: 'short' })
