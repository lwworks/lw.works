import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { invoice } from '@/lib/db/schema/finance'
import { and, eq, inArray, sql } from 'drizzle-orm'

/**
 * Open and partly paid invoices: count and still-open net EUR amount (net share of the unpaid gross), in total and
 * overdue. `today` is `YYYY-MM-DD` in Europe/Berlin.
 */
export const getOutstandingInvoices = async ({ today, sevdeskContactId }: { today: string; sevdeskContactId?: string }) => {
  await requireAdmin()
  const openNet = sql`case when ${invoice.grossEurCents} = 0 then 0 else round(${invoice.netEurCents}::numeric * (${invoice.grossEurCents} - ${invoice.paidEurCents}) / ${invoice.grossEurCents}) end`
  const overdue = sql`${invoice.dueDate} < ${today}`
  const [row] = await getDb()
    .select({
      count: sql<number>`count(*)::int`,
      netEurCents: sql<number>`coalesce(sum(${openNet}), 0)::int`,
      overdueCount: sql<number>`(count(*) filter (where ${overdue}))::int`,
      overdueNetEurCents: sql<number>`coalesce(sum(${openNet}) filter (where ${overdue}), 0)::int`,
    })
    .from(invoice)
    .where(and(inArray(invoice.status, ['open', 'partially_paid']), sevdeskContactId ? eq(invoice.sevdeskContactId, sevdeskContactId) : undefined))
  return row ?? { count: 0, netEurCents: 0, overdueCount: 0, overdueNetEurCents: 0 }
}

export type OutstandingInvoices = Awaited<ReturnType<typeof getOutstandingInvoices>>
