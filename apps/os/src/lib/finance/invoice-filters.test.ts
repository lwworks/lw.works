import { buildInvoicesHref } from '@/lib/finance/build-invoices-href'
import { buildRevenueRangeHref } from '@/lib/finance/build-revenue-range-href'
import { parseInvoiceFilters } from '@/lib/finance/parse-invoice-filters'
import { describe, expect, it } from 'vitest'

describe('parseInvoiceFilters', () => {
  it('defaults to all invoices of the current year', () => {
    expect(parseInvoiceFilters({}, 2026)).toEqual({ view: 'all', year: 2026, month: null })
  })

  it('reads tab and year, and lets a month replace the year', () => {
    expect(parseInvoiceFilters({ ansicht: 'bezahlt', jahr: '2025' }, 2026)).toEqual({ view: 'paid', year: 2025, month: null })
    expect(parseInvoiceFilters({ jahr: '2025', monat: '2026-03' }, 2026)).toEqual({ view: 'all', year: null, month: '2026-03' })
  })

  it('lists open and overdue invoices of all years, unless a month is set', () => {
    expect(parseInvoiceFilters({ ansicht: 'offen', jahr: '2025' }, 2026)).toEqual({ view: 'open', year: null, month: null })
    expect(parseInvoiceFilters({ ansicht: 'ueberfaellig' }, 2026)).toEqual({ view: 'overdue', year: null, month: null })
    expect(parseInvoiceFilters({ ansicht: 'offen', monat: '2026-03' }, 2026)).toEqual({ view: 'open', year: null, month: '2026-03' })
    expect(buildInvoicesHref({ view: 'open', year: 2025 })).toBe('/finanzen/rechnungen?ansicht=offen')
  })

  it('ignores invalid values', () => {
    expect(parseInvoiceFilters({ ansicht: 'x', jahr: 'abc', monat: '2026-13' }, 2026)).toEqual({ view: 'all', year: 2026, month: null })
  })

  it('round-trips with buildInvoicesHref', () => {
    const href = buildInvoicesHref({ view: 'paid', year: 2024 })
    expect(href).toBe('/finanzen/rechnungen?ansicht=bezahlt&jahr=2024')
    expect(parseInvoiceFilters(Object.fromEntries(new URL(href, 'https://x').searchParams), 2026)).toEqual({ view: 'paid', year: 2024, month: null })
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
