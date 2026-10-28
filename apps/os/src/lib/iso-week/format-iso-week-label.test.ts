import { describe, expect, it } from 'vitest'
import { formatIsoWeekLabel } from '@/lib/iso-week/format-iso-week-label'
import { isSameIsoWeek } from '@/lib/iso-week/is-same-iso-week'

describe('formatIsoWeekLabel', () => {
  it('shows Monday to Sunday, across DST changes and year boundaries', () => {
    expect(formatIsoWeekLabel({ year: 2026, week: 43 })).toBe('KW 43 · 19.10.–25.10.2026')
    expect(formatIsoWeekLabel({ year: 2026, week: 13 })).toBe('KW 13 · 23.03.–29.03.2026')
    expect(formatIsoWeekLabel({ year: 2026, week: 53 })).toBe('KW 53 · 28.12.–03.01.2027')
  })
})

describe('isSameIsoWeek', () => {
  it('compares year and week', () => {
    expect(isSameIsoWeek({ year: 2026, week: 1 }, { year: 2026, week: 1 })).toBe(true)
    expect(isSameIsoWeek({ year: 2026, week: 1 }, { year: 2027, week: 1 })).toBe(false)
  })
})
