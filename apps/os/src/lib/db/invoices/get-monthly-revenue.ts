import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { invoice } from '@/lib/db/schema/finance'
import { shiftMonth } from '@/lib/finance/shift-month'
import { listMonths } from '@/lib/finance/list-months'
import { and, gte, lt, ne, sql } from 'drizzle-orm'

/**
 * Net EUR revenue per month (`YYYY-MM`, `from`–`to` included) by invoice date. Drafts never count; cancellations and
 * credit notes count negative. Months without invoices are 0. `count` is the number of invoices (not cancellations).
 */
export const getMonthlyRevenue = async (from: string, to: string) => {
  await requireAdmin()
  const month = sql<string>`to_char(${invoice.invoiceDate}, 'YYYY-MM')`
  const rows = await getDb()
    .select({
      month,
      netEurCents: sql<number>`coalesce(sum(${invoice.netEurCents}), 0)::int`,
      count: sql<number>`(count(*) filter (where ${invoice.kind} = 'invoice'))::int`,
    })
    .from(invoice)
    .where(and(ne(invoice.status, 'draft'), gte(invoice.invoiceDate, `${from}-01`), lt(invoice.invoiceDate, `${shiftMonth(to, 1)}-01`)))
    .groupBy(month)
  const byMonth = new Map(rows.map((row) => [row.month, row]))
  return listMonths(from, to).map((m) => ({ month: m, netEurCents: byMonth.get(m)?.netEurCents ?? 0, count: byMonth.get(m)?.count ?? 0 }))
}

export type MonthlyRevenue = Awaited<ReturnType<typeof getMonthlyRevenue>>
