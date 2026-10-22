import { describe, expect, it } from 'vitest'
import type { GoogleEvent } from './client'
import { SYNC_START, toTimeEntryValues } from './map-event'

const NOW = new Date('2026-06-15T12:00:00.000Z')

const event = (overrides: Partial<GoogleEvent> = {}): GoogleEvent => ({
  id: 'evt-1',
  status: 'confirmed',
  summary: 'Standup',
  start: { dateTime: '2026-06-15T11:00:00.000Z', timeZone: 'Europe/Berlin' },
  end: { dateTime: '2026-06-15T11:30:00.000Z', timeZone: 'Europe/Berlin' },
  updated: '2026-06-15T09:00:00.000Z',
  htmlLink: 'https://calendar.google.com/event?eid=evt-1',
  iCalUID: 'evt-1@google.com',
  ...overrides,
})

const at = (start: Date) =>
  event({
    start: { dateTime: start.toISOString(), timeZone: 'Europe/Berlin' },
    end: { dateTime: new Date(start.getTime() + 30 * 60 * 1000).toISOString(), timeZone: 'Europe/Berlin' },
  })

describe('toTimeEntryValues', () => {
  it('maps a timed busy event that has already started', () => {
    expect(
      toTimeEntryValues(
        event({
          summary: '  Planung  ',
          description: 'Notizen',
          location: 'Raum 2',
          recurringEventId: 'series-1',
          end: { dateTime: '2026-06-15T13:00:00.000Z', timeZone: 'Europe/Berlin' },
          attendees: [
            { email: 'me@lw.works', displayName: 'Ich', responseStatus: 'accepted', self: true, organizer: true },
            { displayName: 'Ohne Mail', responseStatus: 'accepted' },
            { email: 'gast@example.com', optional: true },
          ],
        }),
        NOW,
      ),
    ).toEqual({
      googleEventId: 'evt-1',
      googleRecurringEventId: 'series-1',
      googleICalUid: 'evt-1@google.com',
      title: 'Planung',
      description: 'Notizen',
      location: 'Raum 2',
      attendees: [
        { email: 'me@lw.works', displayName: 'Ich', responseStatus: 'accepted', organizer: true, self: true, optional: undefined },
        { email: 'gast@example.com', displayName: undefined, responseStatus: undefined, organizer: undefined, self: undefined, optional: true },
      ],
      startAt: new Date('2026-06-15T11:00:00.000Z'),
      endAt: new Date('2026-06-15T13:00:00.000Z'),
      timeZone: 'Europe/Berlin',
      htmlLink: 'https://calendar.google.com/event?eid=evt-1',
      googleStatus: 'confirmed',
      googleUpdatedAt: new Date('2026-06-15T09:00:00.000Z'),
    })
  })

  it('falls back to a placeholder title and the sync time when Google omits them', () => {
    const values = toTimeEntryValues(event({ summary: '   ', updated: undefined, status: undefined }), NOW)
    expect(values?.title).toBe('(Kein Titel)')
    expect(values?.googleUpdatedAt).toEqual(NOW)
    expect(values?.googleStatus).toBe('confirmed')
    expect(toTimeEntryValues(event({ summary: undefined }), NOW)?.title).toBe('(Kein Titel)')
  })

  it.each([
    ['an ongoing event', event({ end: { dateTime: '2026-06-15T13:00:00.000Z' } })],
    ['a start equal to now', at(NOW)],
    ['a start equal to 2026-01-01 Europe/Berlin', at(SYNC_START)],
    ['opaque transparency', event({ transparency: 'opaque' })],
    ['missing transparency', event({ transparency: undefined })],
    ['needsAction from the user', event({ attendees: [{ email: 'me@lw.works', self: true, responseStatus: 'needsAction' }] })],
    ['a tentative response', event({ attendees: [{ email: 'me@lw.works', self: true, responseStatus: 'tentative' }] })],
    ['a tentative event status', event({ status: 'tentative' })],
    ['someone else declining', event({
      attendees: [
        { email: 'other@lw.works', responseStatus: 'declined' },
        { email: 'me@lw.works', self: true, responseStatus: 'accepted' },
      ],
    })],
    ['the default event type', event({ eventType: 'default' })],
    ['a fromGmail event', event({ eventType: 'fromGmail' })],
  ])('tracks %s', (_label, googleEvent) => {
    expect(toTimeEntryValues(googleEvent, NOW)).not.toBeNull()
  })

  it.each([
    ['a start one second in the future', at(new Date(NOW.getTime() + 1000))],
    ['a start one millisecond before 2026-01-01 Europe/Berlin', at(new Date(SYNC_START.getTime() - 1))],
    ['a declined response from the user', event({
      attendees: [
        { email: 'other@lw.works', responseStatus: 'accepted' },
        { email: 'me@lw.works', self: true, responseStatus: 'declined' },
      ],
    })],
    ['an all-day event', event({ start: { date: '2026-06-15' }, end: { date: '2026-06-16' } })],
    ['an event without an end time', event({ end: { date: '2026-06-16' } })],
    ['a transparent free event', event({ transparency: 'transparent' })],
    ['an out-of-office event', event({ eventType: 'outOfOffice' })],
    ['a focus-time event', event({ eventType: 'focusTime' })],
    ['a working-location event', event({ eventType: 'workingLocation' })],
    ['a birthday', event({ eventType: 'birthday' })],
    ['a cancelled event', event({ status: 'cancelled' })],
    ['an unparseable start', event({ start: { dateTime: 'not-a-date' } })],
  ])('rejects %s', (_label, googleEvent) => {
    expect(toTimeEntryValues(googleEvent, NOW)).toBeNull()
  })
})
