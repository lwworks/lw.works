import { buildInvoicesHref } from '@/lib/finance/build-invoices-href'
import { buildRevenueRangeHref } from '@/lib/finance/build-revenue-range-href'
import { parseInvoiceFilters } from '@/lib/finance/parse-invoice-filters'
import { describe, expect, it } from 'vitest'

describe('parseInvoiceFilters', () => {
  it('defaults to all invoices of all years', () => {
    expect(parseInvoiceFilters({})).toEqual({ view: 'all', year: null, month: null })
  })

  it('reads tab and year, and lets a month replace the year', () => {
    expect(parseInvoiceFilters({ ansicht: 'ueberfaellig', jahr: '2025' })).toEqual({ view: 'overdue', year: 2025, month: null })
    expect(parseInvoiceFilters({ jahr: '2025', monat: '2026-03' })).toEqual({ view: 'all', year: null, month: '2026-03' })
  })

  it('ignores invalid values', () => {
    expect(parseInvoiceFilters({ ansicht: 'x', jahr: 'abc', monat: '2026-13' })).toEqual({ view: 'all', year: null, month: null })
  })

  it('round-trips with buildInvoicesHref', () => {
    const href = buildInvoicesHref({ view: 'paid', year: 2024 })
    expect(href).toBe('/finanzen/rechnungen?ansicht=bezahlt&jahr=2024')
    expect(parseInvoiceFilters(Object.fromEntries(new URL(href, 'https://x').searchParams))).toEqual({ view: 'paid', year: 2024, month: null })
  })
})

describe('buildRevenueRangeHref', () => {
  it('keeps the default bare', () => {
    expect(buildRevenueRangeHref({ preset: '12m' }, false)).toBe('/finanzen')
  })

  it('adds preset, custom months and comparison', () => {
    expect(buildRevenueRangeHref({ preset: 'jahr' }, true)).toBe('/finanzen?zeitraum=jahr&vergleich=1')
    expect(buildRevenueRangeHref({ preset: 'frei', from: '2024-01', to: '2024-06' }, false)).toBe('/finanzen?zeitraum=frei&von=2024-01&bis=2024-06')
  })
})
