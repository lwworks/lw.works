import { describe, expect, it } from 'vitest'
import { formatBilling } from '@/lib/projects/format-billing'
import { formatCentsInput } from '@/lib/projects/format-cents-input'

describe('formatBilling', () => {
  it.each([
    [{ billing: 'hourly' as const, hourlyRateCents: 9500 }, 'Stundenbasiert · 95 €/h'],
    [{ billing: 'hourly' as const, hourlyRateCents: 9550 }, 'Stundenbasiert · 95,50 €/h'],
    [{ billing: 'fixed' as const, fixedPriceCents: 1200000 }, 'Festpreis · 12.000 €'],
    [{ billing: 'retainer' as const, retainerAmountCents: 250000, retainerHours: 20 }, 'Retainer · 2.500 €/Monat · 20 h/Monat'],
    [{ billing: 'fixed' as const }, 'Festpreis'],
  ])('%j', (project, label) => {
    expect(formatBilling(project).replace(/ /g, ' ')).toBe(label)
  })
})

describe('formatCentsInput', () => {
  it('uses German notation', () => {
    expect(formatCentsInput(123450)).toBe('1.234,50')
  })
})
