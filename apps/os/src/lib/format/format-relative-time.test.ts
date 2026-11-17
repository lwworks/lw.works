import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from '@/lib/format/format-relative-time'

const now = new Date('2026-11-17T12:00:00Z')
const ago = (ms: number) => new Date(now.getTime() - ms)

describe('formatRelativeTime', () => {
  it('formats past dates in German, coarsest unit first', () => {
    expect(formatRelativeTime(ago(20 * 1000), now)).toBe('gerade eben')
    expect(formatRelativeTime(ago(5 * 60 * 1000), now)).toBe('vor 5 Minuten')
    expect(formatRelativeTime(ago(3 * 60 * 60 * 1000), now)).toBe('vor 3 Stunden')
    expect(formatRelativeTime(ago(30 * 60 * 60 * 1000), now)).toBe('gestern')
    expect(formatRelativeTime(ago(63 * 24 * 60 * 60 * 1000), now)).toBe('vor 2 Monaten')
    expect(formatRelativeTime(ago(9 * 7 * 24 * 60 * 60 * 1000), now)).toBe('vor 2 Monaten')
    expect(formatRelativeTime(ago(20 * 24 * 60 * 60 * 1000), now)).toBe('vor 2 Wochen')
  })

  it('treats future dates as now', () => {
    expect(formatRelativeTime(new Date(now.getTime() + 60_000), now)).toBe('gerade eben')
  })
})
