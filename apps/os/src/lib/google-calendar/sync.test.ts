import { calendarSyncState, timeEntry } from '@/db/time-tracking-schema'
import { GoogleCalendarError, type GoogleEvent } from '@/lib/google-calendar/client'
import { SYNC_START } from '@/lib/google-calendar/map-event'
import { syncCalendarState } from '@/lib/google-calendar/sync'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const NOW = new Date('2026-06-15T12:00:00.000Z')
const WINDOW_END = new Date('2026-06-15T10:00:00.000Z')
const OVERLAP_MS = 2 * 60 * 1000
const FULL_SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000

type ListParams = {
  timeMin?: Date
  timeMax?: Date
  updatedMin?: Date
  showDeleted?: boolean
}

type Op =
  | { kind: 'insert'; table: unknown; values: unknown; conflict: unknown }
  | { kind: 'update'; table: unknown; set: Record<string, unknown>; where: unknown }

const harness = vi.hoisted(() => {
  const ops: Op[] = []
  const requests: Array<{ calendarId: string; params: ListParams }> = []
  let lockRows: unknown[] = []
  let pagesFor: (params: ListParams) => unknown[][] = () => [[]]

  const db = {
    insert(table: unknown) {
      return {
        values(values: unknown) {
          return {
            onConflictDoUpdate(conflict: unknown) {
              ops.push({ kind: 'insert', table, values, conflict })
              return Promise.resolve()
            },
          }
        },
      }
    },
    update(table: unknown) {
      return {
        set(set: Record<string, unknown>) {
          return {
            where(where: unknown) {
              ops.push({ kind: 'update', table, set, where })
              return Object.assign(Promise.resolve(), {
                returning: () => Promise.resolve(lockRows),
              })
            },
          }
        },
      }
    },
  }

  return {
    db,
    ops,
    requests,
    setLockRows: (rows: unknown[]) => {
      lockRows = rows
    },
    setPagesFor: (next: (params: ListParams) => unknown[][]) => {
      pagesFor = next
    },
    pagesFor: (params: ListParams) => pagesFor(params),
  }
})

vi.mock('server-only', () => ({}))

vi.mock('@/db', () => ({ getDb: () => harness.db }))

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getAccessToken: async () => ({ accessToken: 'token' }),
      refreshToken: async () => ({ accessToken: 'refreshed-token' }),
    },
  },
}))

vi.mock('@/lib/google-calendar/client', async () => {
  const actual = await vi.importActual<typeof import('@/lib/google-calendar/client')>('@/lib/google-calendar/client')
  return {
    ...actual,
    listEvents: async (
      getAccessToken: (forceRefresh: boolean) => Promise<string>,
      calendarId: string,
      params: ListParams,
      onPage: (events: GoogleEvent[]) => Promise<void>,
    ) => {
      harness.requests.push({ calendarId, params })
      await getAccessToken(false)
      for (const page of harness.pagesFor(params)) await onPage(page as GoogleEvent[])
    },
  }
})

const baseState = {
  id: 'state-1',
  userId: 'user-1',
  accountId: 'account-1',
  calendarId: 'primary',
  status: 'ok' as const,
  lastError: null,
  windowEnd: WINDOW_END,
  changesCheckedAt: WINDOW_END,
  lastFullSyncAt: WINDOW_END,
  lastSyncedAt: WINDOW_END,
  lockedUntil: null,
  createdAt: new Date('2026-01-02T00:00:00.000Z'),
  updatedAt: WINDOW_END,
}

const timed = (id: string, start: string, overrides: Partial<GoogleEvent> = {}): GoogleEvent => ({
  id,
  status: 'confirmed',
  summary: id,
  start: { dateTime: start },
  end: { dateTime: new Date(new Date(start).getTime() + 30 * 60 * 1000).toISOString() },
  updated: '2026-06-15T09:00:00.000Z',
  ...overrides,
})

const containsText = (value: unknown, needle: string, seen = new Set<unknown>()): boolean => {
  if (typeof value === 'string') return value.includes(needle)
  if (typeof value !== 'object' || value === null || seen.has(value)) return false
  seen.add(value)
  const entries = Array.isArray(value) ? value : Object.values(value)
  return entries.some((entry) => containsText(entry, needle, seen))
}

const isEntryInsert = (op: Op): op is Extract<Op, { kind: 'insert' }> => op.kind === 'insert' && op.table === timeEntry
const isEntryUpdate = (op: Op): op is Extract<Op, { kind: 'update' }> => op.kind === 'update' && op.table === timeEntry

const entryInserts = () => harness.ops.filter(isEntryInsert)
const entryUpdates = () => harness.ops.filter(isEntryUpdate)
const stateUpdates = () =>
  harness.ops.filter((op): op is Extract<Op, { kind: 'update' }> => op.kind === 'update' && op.table === calendarSyncState)

const insertedRows = () =>
  entryInserts().flatMap((op) => (Array.isArray(op.values) ? op.values : []) as Array<{
    googleEventId: string
    deletedAt: unknown
    userId: string
    calendarId: string
  }>)

describe('syncCalendarState', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
    harness.ops.length = 0
    harness.requests.length = 0
    harness.setLockRows([{ ...baseState }])
    harness.setPagesFor(() => [[]])
  })

  it('soft-deletes events that stop qualifying, restores eligible ones, and picks up events whose start has passed', async () => {
    const restore = timed('restore-me', '2026-06-15T08:00:00.000Z', { summary: 'Wieder da' })
    const justStarted = timed('just-started', '2026-06-15T11:00:00.000Z')
    harness.setPagesFor((params) => {
      if (params.updatedMin) {
        return [[
          restore,
          timed('future', '2026-06-15T13:00:00.000Z'),
          timed('declined', '2026-06-15T08:00:00.000Z', {
            attendees: [{ email: 'me@lw.works', self: true, responseStatus: 'declined' }],
          }),
          timed('free', '2026-06-15T08:00:00.000Z', { transparency: 'transparent' }),
          timed('all-day', '2026-06-15T08:00:00.000Z', { start: { date: '2026-06-15' }, end: { date: '2026-06-16' } }),
          timed('ooo', '2026-06-15T08:00:00.000Z', { eventType: 'outOfOffice' }),
          timed('focus', '2026-06-15T08:00:00.000Z', { eventType: 'focusTime' }),
          timed('location', '2026-06-15T08:00:00.000Z', { eventType: 'workingLocation' }),
          timed('birthday', '2026-06-15T08:00:00.000Z', { eventType: 'birthday' }),
          timed('cancelled', '2026-06-15T08:00:00.000Z', { status: 'cancelled' }),
        ]]
      }
      return [[justStarted]]
    })

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'ok' })

    const [changes, catchUp] = harness.requests
    expect(changes?.calendarId).toBe('primary')
    expect(changes?.params).toMatchObject({
      showDeleted: true,
      timeMin: SYNC_START,
      updatedMin: new Date(WINDOW_END.getTime() - OVERLAP_MS),
    })
    expect(changes?.params.timeMax).toBeUndefined()
    expect(catchUp?.params).toMatchObject({
      timeMin: new Date(WINDOW_END.getTime() - OVERLAP_MS),
      timeMax: NOW,
    })
    expect(catchUp?.params.updatedMin).toBeUndefined()

    expect(insertedRows().map((row) => row.googleEventId)).toEqual(['restore-me', 'just-started'])
    expect(insertedRows().every((row) => row.deletedAt === null && row.userId === 'user-1' && row.calendarId === 'primary')).toBe(true)

    const conflict = entryInserts()[0]?.conflict as { set?: { deletedAt?: unknown }; setWhere?: unknown }
    expect(conflict.set?.deletedAt).toBeDefined()
    expect(containsText(conflict.setWhere, 'google_updated_at')).toBe(true)

    const insertAt = harness.ops.findIndex((op) => op.kind === 'insert')
    const deleteAt = harness.ops.findIndex((op) => op.kind === 'update' && op.table === timeEntry)
    expect(insertAt).toBeGreaterThan(-1)
    expect(insertAt).toBeLessThan(deleteAt)

    const [cancelledUpdate, untrackedUpdate] = entryUpdates()
    expect(entryUpdates()).toHaveLength(2)
    expect(entryUpdates().every((op) => op.set.deletedAt != null && containsText(op.where, 'user-1') && containsText(op.where, 'primary'))).toBe(true)
    expect(containsText(cancelledUpdate?.where, 'cancelled')).toBe(true)
    for (const id of ['future', 'declined', 'free', 'all-day', 'ooo', 'focus', 'location', 'birthday']) {
      expect(containsText(untrackedUpdate?.where, id)).toBe(true)
    }

    const success = stateUpdates().find((op) => op.set.status === 'ok')
    expect(success?.set).toMatchObject({
      status: 'ok',
      lastError: null,
      lockedUntil: null,
      windowEnd: NOW,
      changesCheckedAt: NOW,
      lastSyncedAt: NOW,
    })
    expect(success?.set).not.toHaveProperty('lastFullSyncAt')
  })

  it('sweeps rows that disappeared from a full reconciliation', async () => {
    harness.setLockRows([{ ...baseState, windowEnd: null, changesCheckedAt: null, lastFullSyncAt: null }])
    harness.setPagesFor(() => [[timed('past', '2026-06-15T08:00:00.000Z')]])

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'ok' })

    expect(harness.requests).toHaveLength(1)
    expect(harness.requests[0]?.params).toMatchObject({ timeMin: SYNC_START, timeMax: NOW })
    expect(harness.requests[0]?.params.updatedMin).toBeUndefined()
    expect(insertedRows().map((row) => row.googleEventId)).toEqual(['past'])
    expect(entryUpdates()).toHaveLength(1)
    expect(entryUpdates()[0]?.set.deletedAt).toBeDefined()
    expect(containsText(entryUpdates()[0]?.where, 'user-1')).toBe(true)
    expect(containsText(entryUpdates()[0]?.where, 'past')).toBe(false)

    const success = stateUpdates().find((op) => op.set.status === 'ok')
    expect(success?.set.lastFullSyncAt).toEqual(NOW)
  })

  it('runs a full reconciliation once the previous one is older than 24 hours', async () => {
    harness.setLockRows([{ ...baseState, lastFullSyncAt: new Date(NOW.getTime() - FULL_SYNC_INTERVAL_MS - 1) }])
    harness.setPagesFor(() => [[]])

    await syncCalendarState('state-1')

    expect(harness.requests).toHaveLength(1)
    expect(harness.requests[0]?.params.timeMax).toEqual(NOW)
    expect(harness.requests[0]?.params.updatedMin).toBeUndefined()
  })

  it('stays incremental when the last full reconciliation is exactly 24 hours old', async () => {
    harness.setLockRows([{ ...baseState, lastFullSyncAt: new Date(NOW.getTime() - FULL_SYNC_INTERVAL_MS) }])
    harness.setPagesFor(() => [[]])

    await syncCalendarState('state-1')

    expect(harness.requests.map((request) => request.params.updatedMin !== undefined)).toEqual([true, false])
  })

  it('falls back to a full reconciliation when Google returns 410', async () => {
    harness.setPagesFor((params) => {
      if (params.updatedMin) throw new GoogleCalendarError(410, ['updatedMinTooLongAgo'], 'updatedMin too long ago')
      return [[timed('just-started', '2026-06-15T11:00:00.000Z')]]
    })

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'ok' })

    expect(harness.requests.map((request) => request.params.updatedMin !== undefined)).toEqual([true, false])
    expect(harness.requests[1]?.params).toMatchObject({ timeMin: SYNC_START, timeMax: NOW })
    expect(insertedRows().map((row) => row.googleEventId)).toEqual(['just-started'])
    expect(entryUpdates().some((op) => op.set.deletedAt != null)).toBe(true)
  })

  it('does nothing when the calendar is already locked', async () => {
    harness.setLockRows([])

    await expect(syncCalendarState('state-1')).resolves.toEqual({ status: 'locked' })

    expect(harness.requests).toHaveLength(0)
    expect(entryInserts()).toHaveLength(0)
    expect(entryUpdates()).toHaveLength(0)
  })
})
