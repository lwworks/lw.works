import { SYNC_START } from '@/lib/google-calendar/to-time-entry-values'
import { parseSyncRange } from '@/lib/time-tracking/parse-sync-range'
import { describe, expect, it } from 'vitest'

const NOW = new Date('2026-06-15T12:00:00.000Z')

describe('parseSyncRange', () => {
  it('spans the picked Berlin days, end day inclusive', () => {
    expect(parseSyncRange({ from: '2026-03-01', to: '2026-03-31' }, NOW)).toEqual({
      from: new Date('2026-02-28T23:00:00.000Z'),
      to: new Date('2026-03-31T22:00:00.000Z'),
    })
  })

  it('clamps to 2026-01-01 and now', () => {
    expect(parseSyncRange({ from: '2025-12-01', to: '2026-06-20' }, NOW)).toEqual({ from: SYNC_START, to: NOW })
  })

  it.each([
    [{ from: 'gestern', to: '2026-06-15' }],
    [{ from: '2026-06-15', to: '2026-06-01' }],
    [{ from: '2026-07-01', to: '2026-07-02' }],
    [{ from: '2025-01-01', to: '2025-12-31' }],
  ])('rejects %o', (days) => {
    expect(parseSyncRange(days, NOW)).toBeNull()
  })
})
