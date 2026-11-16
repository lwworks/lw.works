import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/get-db'
import type { InvoiceView } from '@/lib/db/invoices/invoice-view'
import { company } from '@/lib/db/schema/crm'
import { invoice } from '@/lib/db/schema/finance'
import { shiftMonth } from '@/lib/finance/shift-month'
import { and, desc, eq, gte, inArray, lt, lte, type SQL } from 'drizzle-orm'

const open = inArray(invoice.status, ['open', 'partially_paid'])

/**
 * Invoices, newest first, with the company they are linked to. Filters: tab, calendar year, months `from`–`to`
 * (`YYYY-MM`), SevDesk customer. `today` (`YYYY-MM-DD`, Europe/Berlin) decides what is overdue.
 */
export const listInvoices = async ({
  view = 'all',
  year,
  from,
  to,
  sevdeskContactId,
  today,
}: {
  view?: InvoiceView
  year?: number
  from?: string
  to?: string
  sevdeskContactId?: string
  today: string
}) => {
  await requireAdmin()
  const filters: (SQL | undefined)[] = [
    view === 'draft' ? eq(invoice.status, 'draft') : undefined,
    view === 'open' ? open : undefined,
    view === 'overdue' ? and(open, lt(invoice.dueDate, today)) : undefined,
    view === 'paid' ? eq(invoice.status, 'paid') : undefined,
    year ? and(gte(invoice.invoiceDate, `${year}-01-01`), lte(invoice.invoiceDate, `${year}-12-31`)) : undefined,
    from ? gte(invoice.invoiceDate, `${from}-01`) : undefined,
    to ? lt(invoice.invoiceDate, `${shiftMonth(to, 1)}-01`) : undefined,
    sevdeskContactId ? eq(invoice.sevdeskContactId, sevdeskContactId) : undefined,
  ]
  return getDb()
    .select({
      id: invoice.id,
      kind: invoice.kind,
      number: invoice.number,
      contactName: invoice.contactName,
      subject: invoice.subject,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      currency: invoice.currency,
      netCents: invoice.netCents,
      netEurCents: invoice.netEurCents,
      companyId: company.id,
      companyName: company.name,
      companyLogoKey: company.logoKey,
    })
    .from(invoice)
    .leftJoin(company, eq(company.sevdeskContactId, invoice.sevdeskContactId))
    .where(and(...filters))
    .orderBy(desc(invoice.invoiceDate), desc(invoice.number))
}

export type InvoiceListItem = Awaited<ReturnType<typeof listInvoices>>[number]
