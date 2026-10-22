import { calendarSyncState, timeEntry } from '@/lib/db/schema/time-tracking'
import { GoogleCalendarError } from '@/lib/google-calendar/google-calendar-error'
import type { GoogleEvent, ListEventsParams } from '@/lib/google-calendar/list-events'
import { syncCalendarState } from '@/lib/google-calendar/sync-calendar-state'
import { SYNC_START } from '@/lib/google-calendar/to-time-entry-values'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const NOW = new Date('2026-06-15T12:00:00.000Z')
const SYNCED_UNTIL = new Date('2026-06-15T10:00:00.000Z')
const SINCE = new Date(SYNCED_UNTIL.getTime() - 2 * 60 * 1000)
const DAY_MS = 24 * 60 * 60 * 1000

type Write = { kind: 'insert' | 'update'; table: unknown; values?: Record<string, unknown>[]; set?: Record<string, unknown>; where?: unknown; conflict?: unknown }

const fake = vi.hoisted(() => ({
  writes: [] as Write[],
  requests: [] as ListEventsParams[],
  lockedState: null as unknown,
  pages: (() => []) as (params: ListEventsParams) => unknown[],
}))

vi.mock('server-only', () => ({}))
vi.mock('@/lib/auth/auth', () => ({
  auth: { api: { getAccessToken: async () => ({ accessToken: 'token' }), refreshToken: async () => ({ accessToken: 'token' }) } },
}))
vi.mock('@/lib/db/get-db', () => ({
  getDb: () => ({
    insert: (table: unknown) => ({
      values: (values: Record<string, unknown>[]) => ({
        onConflictDoUpdate: async (conflict: unknown) => void fake.writes.push({ kind: 'insert', table, values, conflict }),
      }),
    }),
    update: (table: unknown) => ({
      set: (set: Record<string, unknown>) => ({
        where: (where: unknown) => {
          fake.writes.push({ kind: 'update', table, set, where })
          return Object.assign(Promise.resolve(), { returning: async () => (fake.lockedState ? [fake.lockedState] : []) })
        },
      }),
    }),
  }),
}))
vi.mock('@/lib/google-calendar/list-events', () => ({
  listEvents: async (getAccessToken: (force: boolean) => Promise<string>, _calendarId: string, params: ListEventsParams, onPage: (events: GoogleEvent[]) => Promise<void>) => {
    fake.requests.push(params)
    await getAccessToken(false)
    await onPage(fake.pages(params) as GoogleEvent[])
  },
}))

const state = (overrides = {}) => ({
  id: 'state-1',
  userId: 'user-1',
  accountId: 'account-1',
  calendarId: 'primary',
  status: 'ok',
  syncedUntil: SYNCED_UNTIL,
  lastFullSyncAt: SYNCED_UNTIL,
  lockedUntil: null,
  ...overrides,
})

const event = (id: string, start: string, overrides: Partial<GoogleEvent> = {}): GoogleEvent => ({
  id,
  start: { dateTime: start },
  end: { dateTime: new Date(new Date(start).getTime() + 30 * 60 * 1000).toISOString() },
  updated: '2026-06-15T09:00:00.000Z',
  ...overrides,
})

// Drizzle SQL objects are circular, so search them recursively instead of serialising.
const mentions = (value: unknown, needle: string, seen = new Set<unknown>()): boolean => {
  if (typeof value === 'string') return value.includes(needle)
  if (typeof value !== 'object' || value === null || seen.has(value)) return false
  seen.add(value)
  return Object.values(value).some((inner) => mentions(inner, needle, seen))
}

const upsertedIds = () => fake.writes.filter((write) => write.kind === 'insert').flatMap((write) => write.values?.map((row) => row.googleEventId) ?? [])
const softDeletes = () => fake.writes.filter((write) => write.kind === 'update' && write.table === timeEntry)
const finalState = () => fake.writes.findLast((write) => write.table === calendarSyncState)?.set

describe('syncCalendarState', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
    fake.writes = []
    fake.requests = []
    fake.lockedState = state()
    fake.pages = () => []
  })

  it('applies changes, then picks up events whose start passed since the last run', async () => {
    fake.pages = (params) =>
      params.updatedMin
        ? [
          event('edited', '2026-06-15T08:00:00.000Z'),
          event('future', '2026-06-15T13:00:00.000Z'),
          event('declined', '2026-06-15T08:00:00.000Z', { attendees: [{ email: 'me@lw.works', self: true, responseStatus: 'declined' }] }),
          event('cancelled-series', '2026-06-15T08:00:00.000Z', { status: 'cancelled' }),
        ]
        : [event('just-started', '2026-06-15T11:00:00.000Z')]

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'ok' })

    expect(fake.requests).toEqual([
      { updatedMin: SINCE, timeMin: SYNC_START, showDeleted: true },
      { timeMin: SINCE, timeMax: NOW },
    ])
    expect(upsertedIds()).toEqual(['edited', 'just-started'])
    expect(mentions((fake.writes[1]?.conflict as { setWhere?: unknown }).setWhere, 'google_updated_at')).toBe(true)
    expect(softDeletes()).toHaveLength(1)
    for (const id of ['future', 'declined', 'cancelled-series']) expect(mentions(softDeletes()[0]?.where, id)).toBe(true)
    expect(finalState()).toMatchObject({ status: 'ok', syncedUntil: NOW, lastFullSyncAt: SYNCED_UNTIL, lockedUntil: null })
  })

  it.each([
    ['the first run', { syncedUntil: null, lastFullSyncAt: null }],
    ['the last full sync being older than 24 hours', { lastFullSyncAt: new Date(NOW.getTime() - DAY_MS - 1) }],
  ])('runs a full sync and sweeps unseen rows on %s', async (_label, overrides) => {
    fake.lockedState = state(overrides)
    fake.pages = () => [event('past', '2026-06-15T08:00:00.000Z')]

    await syncCalendarState('state-1')

    expect(fake.requests).toEqual([{ timeMin: SYNC_START, timeMax: NOW }])
    expect(upsertedIds()).toEqual(['past'])
    expect(mentions(softDeletes()[0]?.where, 'last_seen_at')).toBe(true)
    expect(finalState()).toMatchObject({ status: 'ok', syncedUntil: NOW, lastFullSyncAt: NOW })
  })

  it('falls back to a full sync when Google returns 410', async () => {
    fake.pages = (params) => {
      if (params.updatedMin) throw new GoogleCalendarError(410, ['updatedMinTooLongAgo'], 'Gone')
      return []
    }

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'ok' })

    expect(fake.requests.at(-1)).toEqual({ timeMin: SYNC_START, timeMax: NOW })
    expect(finalState()).toMatchObject({ lastFullSyncAt: NOW })
  })

  it('marks missing calendar permission', async () => {
    fake.pages = () => {
      throw new GoogleCalendarError(403, ['insufficientPermissions'], 'Forbidden')
    }

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'missing_scope' })
    expect(finalState()).toMatchObject({ status: 'missing_scope', lockedUntil: null })
  })

  it('does nothing when another run holds the lock', async () => {
    fake.lockedState = null

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'locked' })
    expect(fake.requests).toHaveLength(0)
  })
})
