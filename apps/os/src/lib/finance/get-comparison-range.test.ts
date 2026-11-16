import { getComparisonRange } from '@/lib/finance/get-comparison-range'
import { listMonths } from '@/lib/finance/list-months'
import { shiftMonth } from '@/lib/finance/shift-month'
import { describe, expect, it } from 'vitest'

describe('month helpers', () => {
  it('shifts across years', () => {
    expect(shiftMonth('2026-01', -1)).toBe('2025-12')
    expect(shiftMonth('2025-12', 1)).toBe('2026-01')
    expect(shiftMonth('2026-11', -11)).toBe('2025-12')
  })

  it('lists months inclusively', () => {
    expect(listMonths('2025-11', '2026-02')).toEqual(['2025-11', '2025-12', '2026-01', '2026-02'])
    expect(listMonths('2026-02', '2026-01')).toEqual([])
  })
})

describe('getComparisonRange', () => {
  it('moves ranges of up to 12 months back a year', () => {
    expect(getComparisonRange({ from: '2025-12', to: '2026-11' })).toEqual({ from: '2024-12', to: '2025-11' })
  })

  it('has no comparison for longer ranges', () => {
    expect(getComparisonRange({ from: '2023-01', to: '2026-11' })).toBeNull()
  })
})
