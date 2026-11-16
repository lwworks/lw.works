import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { getInvoice } from '@/lib/db/invoices/get-invoice'
import { getSevdeskPdf } from '@/lib/sevdesk/get-sevdesk-pdf'

/** PDF bytes and a file name for an invoice, or null if there is no such invoice. Admins only. */
export const loadInvoicePdf = async (id: string) => {
  await requireAdmin()
  const invoice = await getInvoice(id)
  if (!invoice) return null
  const name = (invoice.number ?? `Entwurf-${invoice.sevdeskId}`).replace(/[^\w.-]+/g, '-')
  return { bytes: await getSevdeskPdf(invoice), fileName: `${name}.pdf` }
}
