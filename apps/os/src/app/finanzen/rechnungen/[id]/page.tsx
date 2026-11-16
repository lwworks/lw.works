import { InvoicePage } from '@/components/pages/invoice'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getInvoice } from '@/lib/db/invoices/get-invoice'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = { title: 'Rechnung' }

export default async function Page({ params }: PageProps<'/finanzen/rechnungen/[id]'>) {
  await requireAdmin()
  const invoice = await getInvoice((await params).id)
  if (!invoice) notFound()
  return <InvoicePage invoice={invoice} today={toZonedDateKey(new Date())} />
}
