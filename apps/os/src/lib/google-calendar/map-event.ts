import type { TimeEntryAttendee } from '@/db/time-tracking-schema'
import type { GoogleEvent } from './client'

export const SYNC_START = new Date('2026-01-01T00:00:00+01:00')

const EXCLUDED_EVENT_TYPES = new Set(['outOfOffice', 'focusTime', 'workingLocation', 'birthday'])

export type TimeEntryValues = {
  googleEventId: string
  googleRecurringEventId: string | null
  googleICalUid: string | null
  title: string
  description: string | null
  location: string | null
  attendees: TimeEntryAttendee[]
  startAt: Date
  endAt: Date
  timeZone: string | null
  htmlLink: string | null
  googleStatus: string
  googleUpdatedAt: Date
}

const toAttendees = (event: GoogleEvent): TimeEntryAttendee[] =>
  (event.attendees ?? [])
    .filter((attendee) => attendee.email)
    .map((attendee) => ({
      email: attendee.email as string,
      displayName: attendee.displayName,
      responseStatus: attendee.responseStatus,
      organizer: attendee.organizer,
      self: attendee.self,
      optional: attendee.optional,
    }))

/**
 * Returns the time entry values for an event that should be tracked, or `null`
 * when the event is cancelled, all-day, free, declined, of an excluded type, or
 * has not started yet (start must lie in `[SYNC_START, now]`).
 */
export const toTimeEntryValues = (event: GoogleEvent, now: Date): TimeEntryValues | null => {
  if (event.status === 'cancelled') return null
  if (!event.start?.dateTime || !event.end?.dateTime) return null
  if (event.transparency === 'transparent') return null
  if (event.eventType && EXCLUDED_EVENT_TYPES.has(event.eventType)) return null
  if (event.attendees?.some((attendee) => attendee.self && attendee.responseStatus === 'declined')) return null

  const startAt = new Date(event.start.dateTime)
  const endAt = new Date(event.end.dateTime)
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) return null
  if (startAt < SYNC_START || startAt > now) return null

  return {
    googleEventId: event.id,
    googleRecurringEventId: event.recurringEventId ?? null,
    googleICalUid: event.iCalUID ?? null,
    title: event.summary?.trim() || '(Kein Titel)',
    description: event.description ?? null,
    location: event.location ?? null,
    attendees: toAttendees(event),
    startAt,
    endAt,
    timeZone: event.start.timeZone ?? null,
    htmlLink: event.htmlLink ?? null,
    googleStatus: event.status ?? 'confirmed',
    googleUpdatedAt: event.updated ? new Date(event.updated) : now,
  }
}
