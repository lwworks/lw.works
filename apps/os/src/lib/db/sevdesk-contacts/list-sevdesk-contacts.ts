import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { invoice, sevdeskContact } from '@/lib/db/schema/finance'
import { asc, eq, sql } from 'drizzle-orm'

/** SevDesk customers by name, with their number of non-draft invoices and the company they are linked to. */
export const listSevdeskContacts = async () => {
  await requireAdmin()
  return getDb()
    .select({
      id: sevdeskContact.id,
      name: sevdeskContact.name,
      customerNumber: sevdeskContact.customerNumber,
      invoiceCount: sql<number>`(select count(*)::int from ${invoice} where ${invoice.sevdeskContactId} = ${sevdeskContact.id} and ${invoice.status} <> 'draft')`,
      companyId: company.id,
      companyName: company.name,
    })
    .from(sevdeskContact)
    .leftJoin(company, eq(company.sevdeskContactId, sevdeskContact.id))
    .orderBy(asc(sevdeskContact.name))
}

export type SevdeskContactOption = Awaited<ReturnType<typeof listSevdeskContacts>>[number]
