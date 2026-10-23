import { calendarSyncState, timeEntry } from '@/lib/db/schema/time-tracking'
import { GoogleCalendarError } from '@/lib/google-calendar/google-calendar-error'
import type { GoogleEvent, ListEventsParams } from '@/lib/google-calendar/list-events'
import { syncCalendarState } from '@/lib/google-calendar/sync-calendar-state'
import { SYNC_START } from '@/lib/google-calendar/to-time-entry-values'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const NOW = new Date('2026-06-15T12:00:00.000Z')
const LAST_SYNCED = new Date('2026-06-15T11:45:00.000Z')
const WEEK_AGO = new Date('2026-06-08T12:00:00.000Z')

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
  lastSyncedAt: LAST_SYNCED,
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

const upserts = () => fake.writes.filter((write) => write.kind === 'insert')
const upsertedIds = () => upserts().flatMap((write) => write.values?.map((row) => row.googleEventId) ?? [])
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

  it('re-syncs the last 7 days: upserts qualifying events and soft-deletes unseen entries in the window', async () => {
    fake.pages = () => [
      event('meeting', '2026-06-15T08:00:00.000Z'),
      event('declined', '2026-06-15T09:00:00.000Z', { attendees: [{ email: 'me@lw.works', self: true, responseStatus: 'declined' }] }),
      event('free', '2026-06-15T10:00:00.000Z', { transparency: 'transparent' }),
    ]

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'ok' })

    expect(fake.requests).toEqual([{ timeMin: WEEK_AGO, timeMax: NOW }])
    expect(upsertedIds()).toEqual(['meeting'])
    expect(upserts()[0]?.values?.[0]).toMatchObject({ userId: 'user-1', calendarId: 'primary', lastSeenAt: NOW, deletedAt: null })
    expect(mentions((upserts()[0]?.conflict as { setWhere?: unknown }).setWhere, 'google_updated_at')).toBe(true)

    expect(softDeletes()).toHaveLength(1)
    const sweep = softDeletes()[0]?.where
    for (const needle of ['user-1', 'primary', 'start_at', 'last_seen_at', 'deleted_at']) expect(mentions(sweep, needle)).toBe(true)
    expect(finalState()).toMatchObject({ status: 'ok', lastError: null, lastSyncedAt: NOW, lockedUntil: null })
  })

  it('covers everything since 2026-01-01 on the first sync', async () => {
    fake.lockedState = state({ lastSyncedAt: null })

    await syncCalendarState('state-1')

    expect(fake.requests).toEqual([{ timeMin: SYNC_START, timeMax: NOW }])
  })

  it('syncs an explicit range', async () => {
    const range = { from: new Date('2026-03-01T00:00:00.000Z'), to: new Date('2026-03-08T00:00:00.000Z') }

    await syncCalendarState('state-1', range)

    expect(fake.requests).toEqual([{ timeMin: range.from, timeMax: range.to }])
  })

  it('marks missing calendar permission and touches no entries', async () => {
    fake.pages = () => {
      throw new GoogleCalendarError(403, ['insufficientPermissions'], 'Forbidden')
    }

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'missing_scope' })
    expect(softDeletes()).toHaveLength(0)
    expect(finalState()).toMatchObject({ status: 'missing_scope', lockedUntil: null })
  })

  it('does nothing when another run holds the lock', async () => {
    fake.lockedState = null

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'locked' })
    expect(fake.requests).toHaveLength(0)
  })
})
