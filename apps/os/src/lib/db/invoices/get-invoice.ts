import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import { company } from '@/lib/db/schema/crm'
import { invoice, sevdeskContact } from '@/lib/db/schema/finance'
import { eq } from 'drizzle-orm'

/** One invoice with its SevDesk customer and linked company, or null. */
export const getInvoice = async (id: string) => {
  await requireAdmin()
  const [row] = await getDb()
    .select({
      invoice,
      customer: { id: sevdeskContact.id, name: sevdeskContact.name, customerNumber: sevdeskContact.customerNumber },
      company: { id: company.id, name: company.name, logoKey: company.logoKey },
    })
    .from(invoice)
    .leftJoin(sevdeskContact, eq(sevdeskContact.id, invoice.sevdeskContactId))
    .leftJoin(company, eq(company.sevdeskContactId, invoice.sevdeskContactId))
    .where(eq(invoice.id, id))
    .limit(1)
  if (!row) return null
  const original = row.invoice.originalInvoiceId
    ? ((await getDb().select({ id: invoice.id, number: invoice.number }).from(invoice).where(eq(invoice.id, row.invoice.originalInvoiceId)).limit(1))[0] ?? null)
    : null
  const cancellation =
    row.invoice.status === 'cancelled'
      ? ((await getDb().select({ id: invoice.id, number: invoice.number }).from(invoice).where(eq(invoice.originalInvoiceId, row.invoice.id)).limit(1))[0] ?? null)
      : null
  return { ...row.invoice, customer: row.customer, company: row.company, original, cancellation }
}

export type InvoiceDetail = NonNullable<Awaited<ReturnType<typeof getInvoice>>>
