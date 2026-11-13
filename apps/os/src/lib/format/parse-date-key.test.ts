import { describe, expect, it } from 'vitest'
import { formatDateKey } from '@/lib/format/format-date-key'
import { parseDateKey } from '@/lib/format/parse-date-key'

describe('parseDateKey', () => {
  it('round-trips with formatDateKey', () => {
    const date = parseDateKey('2026-02-28')
    expect(date && formatDateKey(date)).toBe('2026-02-28')
  })

  it('rejects empty, malformed and impossible dates', () => {
    expect(parseDateKey('')).toBeUndefined()
    expect(parseDateKey(null)).toBeUndefined()
    expect(parseDateKey('28.02.2026')).toBeUndefined()
    expect(parseDateKey('2026-02-30')).toBeUndefined()
  })
})
