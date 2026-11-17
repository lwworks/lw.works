import type { InvoiceView } from '@/lib/db/invoices/invoice-view'
import { spansAllYears } from '@/lib/finance/spans-all-years'

/** URL value of each list tab; `alle` is the default and stays out of the URL. */
const VIEWS: Record<string, InvoiceView> = { entwuerfe: 'draft', offen: 'open', ueberfaellig: 'overdue', bezahlt: 'paid' }

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

/**
 * `?ansicht=offen&jahr=2025` or `?monat=2026-03` (from a chart bar) → list filters. A month replaces the year;
 * without either, the list shows `currentYear`. Open and overdue invoices ignore the year.
 */
export const parseInvoiceFilters = (
  params: { ansicht?: string | string[]; jahr?: string | string[]; monat?: string | string[] },
  currentYear: number,
) => {
  const view = VIEWS[first(params.ansicht) ?? ''] ?? 'all'
  const month = first(params.monat)
  if (month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return { view, year: null, month }
  if (spansAllYears(view)) return { view, year: null, month: null }
  const year = Number(first(params.jahr))
  return { view, year: Number.isInteger(year) && year >= 2000 && year <= 2100 ? year : currentYear, month: null }
}
