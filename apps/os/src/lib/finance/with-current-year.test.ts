import { withCurrentYear } from '@/lib/finance/with-current-year'
import { describe, expect, it } from 'vitest'

describe('withCurrentYear', () => {
  it('keeps the list when the current year has invoices', () => {
    expect(withCurrentYear([2026, 2025], 2026)).toEqual([2026, 2025])
  })

  it('adds the current year in order', () => {
    expect(withCurrentYear([2025, 2024], 2026)).toEqual([2026, 2025, 2024])
    expect(withCurrentYear([], 2026)).toEqual([2026])
  })
})
