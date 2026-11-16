import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { invoice } from '@/lib/db/schema/finance'
import { shiftMonth } from '@/lib/finance/shift-month'
import { and, eq, gte, lt, ne, sql } from 'drizzle-orm'

/** Net EUR revenue (drafts excluded) for optional months `from`–`to` and an optional SevDesk customer. */
export const getRevenueTotal = async ({ from, to, sevdeskContactId }: { from?: string; to?: string; sevdeskContactId?: string } = {}) => {
  await requireAdmin()
  const [row] = await getDb()
    .select({ netEurCents: sql<number>`coalesce(sum(${invoice.netEurCents}), 0)::int` })
    .from(invoice)
    .where(
      and(
        ne(invoice.status, 'draft'),
        from ? gte(invoice.invoiceDate, `${from}-01`) : undefined,
        to ? lt(invoice.invoiceDate, `${shiftMonth(to, 1)}-01`) : undefined,
        sevdeskContactId ? eq(invoice.sevdeskContactId, sevdeskContactId) : undefined,
      ),
    )
  return row?.netEurCents ?? 0
}
