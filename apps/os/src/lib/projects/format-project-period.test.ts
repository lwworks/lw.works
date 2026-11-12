import { describe, expect, it } from 'vitest'
import { formatProjectPeriod } from '@/lib/projects/format-project-period'

describe('formatProjectPeriod', () => {
  it.each([
    [{ startDate: '2026-11-01', endDate: '2026-12-31' }, '01.11.2026 – 31.12.2026'],
    [{ startDate: '2026-11-01', endDate: null }, 'ab 01.11.2026'],
    [{ startDate: null, endDate: '2026-12-31' }, 'bis 31.12.2026'],
    [{ startDate: null, endDate: null }, null],
  ])('%j', (dates, label) => {
    expect(formatProjectPeriod(dates)).toBe(label)
  })
})
