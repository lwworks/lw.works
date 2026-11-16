import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { invoice } from '@/lib/db/schema/finance'
import { sql } from 'drizzle-orm'

/** Calendar years that have invoices, newest first. */
export const listInvoiceYears = async () => {
  await requireAdmin()
  const year = sql<number>`extract(year from ${invoice.invoiceDate})::int`
  const rows = await getDb().selectDistinct({ year }).from(invoice).orderBy(sql`1 desc`)
  return rows.map((row) => row.year)
}
