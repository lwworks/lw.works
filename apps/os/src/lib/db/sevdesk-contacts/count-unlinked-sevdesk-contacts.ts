import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { invoice, sevdeskContact } from '@/lib/db/schema/finance'
import { and, eq, exists, isNull, ne, sql } from 'drizzle-orm'

/** SevDesk customers with at least one non-draft invoice that no company is linked to. */
export const countUnlinkedSevdeskContacts = async () => {
  await requireAdmin()
  const [row] = await getDb()
    .select({ count: sql<number>`count(*)::int` })
    .from(sevdeskContact)
    .leftJoin(company, eq(company.sevdeskContactId, sevdeskContact.id))
    .where(
      and(
        isNull(company.id),
        exists(getDb().select({ one: sql`1` }).from(invoice).where(and(eq(invoice.sevdeskContactId, sevdeskContact.id), ne(invoice.status, 'draft')))),
      ),
    )
  return row?.count ?? 0
}
