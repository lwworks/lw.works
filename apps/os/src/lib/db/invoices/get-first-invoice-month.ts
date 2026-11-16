import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { invoice } from '@/lib/db/schema/finance'
import { min, ne } from 'drizzle-orm'

/** `YYYY-MM` of the first non-draft invoice, or null. */
export const getFirstInvoiceMonth = async () => {
  await requireAdmin()
  const [row] = await getDb().select({ first: min(invoice.invoiceDate) }).from(invoice).where(ne(invoice.status, 'draft'))
  return row?.first ? row.first.slice(0, 7) : null
}
