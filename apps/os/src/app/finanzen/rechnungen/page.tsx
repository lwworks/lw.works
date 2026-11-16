import { InvoicesPage } from '@/components/pages/invoices'
import { requireAdmin } from '@/lib/auth/require-admin'
import { listInvoiceYears } from '@/lib/db/invoices/list-invoice-years'
import { listInvoices } from '@/lib/db/invoices/list-invoices'
import { parseInvoiceFilters } from '@/lib/finance/parse-invoice-filters'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Rechnungen' }

export default async function Page({ searchParams }: PageProps<'/finanzen/rechnungen'>) {
  await requireAdmin()
  const { view, year, month } = parseInvoiceFilters(await searchParams)
  const today = toZonedDateKey(new Date())
  const [invoices, years] = await Promise.all([
    listInvoices({ view, year: year ?? undefined, from: month ?? undefined, to: month ?? undefined, today }),
    listInvoiceYears(),
  ])
  return <InvoicesPage invoices={invoices} view={view} year={year} month={month} years={years} today={today} />
}
