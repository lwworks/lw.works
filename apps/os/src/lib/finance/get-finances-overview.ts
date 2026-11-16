import 'server-only'

import { getFirstInvoiceMonth } from '@/lib/db/invoices/get-first-invoice-month'
import { getMonthlyRevenue } from '@/lib/db/invoices/get-monthly-revenue'
import { getOutstandingInvoices } from '@/lib/db/invoices/get-outstanding-invoices'
import { countUnlinkedSevdeskContacts } from '@/lib/db/sevdesk-contacts/count-unlinked-sevdesk-contacts'
import { getSevdeskSyncState } from '@/lib/db/sevdesk-sync-states/get-sevdesk-sync-state'
import { buildRevenueChartData } from '@/lib/finance/build-revenue-chart-data'
import { getComparisonRange } from '@/lib/finance/get-comparison-range'
import { listMonths } from '@/lib/finance/list-months'
import { parseRevenueRange } from '@/lib/finance/parse-revenue-range'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'

const sum = (rows: { netEurCents: number }[]) => rows.reduce((total, row) => total + row.netEurCents, 0)

/** Everything `/finanzen` shows, for the range in the URL. Admins only (the queries check). */
export const getFinancesOverview = async (params: { zeitraum?: string | string[]; von?: string | string[]; bis?: string | string[]; vergleich?: string | string[] }) => {
  const today = toZonedDateKey(new Date())
  const currentMonth = today.slice(0, 7)
  const firstMonth = await getFirstInvoiceMonth()
  const range = parseRevenueRange(params, currentMonth, firstMonth)
  const comparisonRange = getComparisonRange(range)
  const compare = params.vergleich === '1' && comparisonRange !== null

  const [monthly, comparison, outstanding, unlinkedCustomers, syncState] = await Promise.all([
    getMonthlyRevenue(range.from, range.to),
    compare && comparisonRange ? getMonthlyRevenue(comparisonRange.from, comparisonRange.to) : null,
    getOutstandingInvoices({ today }),
    countUnlinkedSevdeskContacts(),
    getSevdeskSyncState(),
  ])

  // The average only counts months that have started, so the current year isn't diluted by empty future months.
  const elapsed = monthly.filter((row) => row.month <= currentMonth)
  const totalNetEurCents = sum(monthly)
  return {
    range,
    compare,
    canCompare: comparisonRange !== null,
    months: listMonths(firstMonth ?? currentMonth, currentMonth),
    chart: buildRevenueChartData(monthly, comparison),
    totalNetEurCents,
    averageNetEurCents: elapsed.length > 0 ? Math.round(sum(elapsed) / elapsed.length) : 0,
    // Compare like with like: only the months of the comparison year that match elapsed months.
    comparisonTotalNetEurCents: comparison ? sum(comparison.slice(0, elapsed.length)) : null,
    invoiceCount: monthly.reduce((total, row) => total + row.count, 0),
    outstanding,
    unlinkedCustomers,
    syncState,
  }
}
