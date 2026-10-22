import type { GoogleEvent } from './client'

export const SYNC_START = new Date('2026-01-01T00:00:00+01:00')

const EXCLUDED_EVENT_TYPES = new Set(['outOfOffice', 'focusTime', 'workingLocation', 'birthday'])

export type TimeEntryValues = NonNullable<ReturnType<typeof toTimeEntryValues>>

/** Values for an event that counts as tracked time, or `null` if it doesn't (or hasn't started yet). */
export const toTimeEntryValues = (event: GoogleEvent, now: Date) => {
  if (event.status === 'cancelled') return null
  if (!event.start?.dateTime || !event.end?.dateTime) return null
  if (event.transparency === 'transparent') return null
  if (event.eventType && EXCLUDED_EVENT_TYPES.has(event.eventType)) return null
  if (event.attendees?.some((attendee) => attendee.self && attendee.responseStatus === 'declined')) return null

  const startAt = new Date(event.start.dateTime)
  if (startAt < SYNC_START || startAt > now) return null

  return {
    googleEventId: event.id,
    googleRecurringEventId: event.recurringEventId ?? null,
    googleICalUid: event.iCalUID ?? null,
    title: event.summary?.trim() || '(Kein Titel)',
    description: event.description ?? null,
    location: event.location ?? null,
    attendees: (event.attendees ?? []).flatMap(({ email, displayName, responseStatus, organizer, self, optional }) =>
      email ? [{ email, displayName, responseStatus, organizer, self, optional }] : [],
    ),
    startAt,
    endAt: new Date(event.end.dateTime),
    timeZone: event.start.timeZone ?? null,
    htmlLink: event.htmlLink ?? null,
    googleStatus: event.status ?? 'confirmed',
    googleUpdatedAt: event.updated ? new Date(event.updated) : now,
  }
}
