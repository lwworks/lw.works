import type { InvoiceView } from '@/lib/db/invoices/invoice-view'
import { spansAllYears } from '@/lib/finance/spans-all-years'

const VIEW_PARAMS: Record<InvoiceView, string | null> = { all: null, draft: 'entwuerfe', open: 'offen', overdue: 'ueberfaellig', paid: 'bezahlt' }

/** `/finanzen/rechnungen` URL for a tab plus a year or a month. */
export const buildInvoicesHref = ({ view, year, month }: { view: InvoiceView; year?: number | null; month?: string | null }) => {
  const params = new URLSearchParams()
  const viewParam = VIEW_PARAMS[view]
  if (viewParam) params.set('ansicht', viewParam)
  if (month) params.set('monat', month)
  else if (year && !spansAllYears(view)) params.set('jahr', String(year))
  const query = params.toString()
  return query ? `/finanzen/rechnungen?${query}` : '/finanzen/rechnungen'
}
