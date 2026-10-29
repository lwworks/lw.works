import { describe, expect, it } from 'vitest'
import { isAfterIsoWeek } from '@/lib/iso-week/is-after-iso-week'

describe('isAfterIsoWeek', () => {
  it('compares weeks within and across years', () => {
    expect(isAfterIsoWeek({ year: 2026, week: 45 }, { year: 2026, week: 44 })).toBe(true)
    expect(isAfterIsoWeek({ year: 2027, week: 1 }, { year: 2026, week: 53 })).toBe(true)
    expect(isAfterIsoWeek({ year: 2026, week: 44 }, { year: 2026, week: 44 })).toBe(false)
    expect(isAfterIsoWeek({ year: 2026, week: 53 }, { year: 2027, week: 1 })).toBe(false)
  })
})
