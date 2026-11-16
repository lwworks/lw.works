import { formatMoney } from '@/lib/format/format-money'
import { describe, expect, it } from 'vitest'

describe('formatMoney', () => {
  it('formats cents', () => {
    expect(formatMoney(171360)).toBe('1.713,60 €')
    expect(formatMoney(-67600)).toBe('-676,00 €')
    expect(formatMoney(1277000, 'USD')).toBe('12.770,00 $')
    expect(formatMoney(1091891, 'EUR', { whole: true })).toBe('10.919 €')
  })
})
