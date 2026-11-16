import type { InvoiceKind } from '@/lib/db/schema/finance'
import type { SevdeskInvoiceRow } from '@/lib/sevdesk/sevdesk-invoice-row'
import { SEVDESK_STATUSES } from '@/lib/sevdesk/sevdesk-statuses'
import { toCents } from '@/lib/sevdesk/to-cents'
import { toDateOnly } from '@/lib/sevdesk/to-date-only'
import type { SevdeskInvoiceObject } from '@/lib/sevdesk/types'

/** `RE` invoice, `AR` advance, `TR` partial, `ER` final invoice, `SR` cancellation. Others (`MA` dunning, `WKR` recurring template) are not revenue. */
const KINDS: Record<string, InvoiceKind> = { RE: 'invoice', AR: 'invoice', TR: 'invoice', ER: 'invoice', SR: 'cancellation' }

const addDays = (date: string, days: number) => {
  const result = new Date(`${date}T00:00:00Z`)
  result.setUTCDate(result.getUTCDate() + days)
  return result.toISOString().slice(0, 10)
}

/**
 * SevDesk invoice → `invoice` row, or null when it is not revenue (dunning, recurring template, unknown status).
 * `sumNet`/`sumGross` are already EUR; in another currency, the original amounts are `*ForeignCurrency`.
 */
export const mapSevdeskInvoice = (object: SevdeskInvoiceObject, customerIdByContactId: ReadonlyMap<string, string>): SevdeskInvoiceRow | null => {
  const kind = KINDS[object.invoiceType]
  const status = SEVDESK_STATUSES[object.status]
  const invoiceDate = toDateOnly(object.invoiceDate)
  if (!kind || !status || !invoiceDate) return null

  const currency = object.currency || 'EUR'
  const isForeign = currency !== 'EUR'
  const netEurCents = toCents(object.sumNet)
  const grossEurCents = toCents(object.sumGross)
  const timeToPay = Number.parseInt(object.timeToPay ?? '', 10)
  const customerId = object.contact ? (customerIdByContactId.get(object.contact.id) ?? null) : null

  return {
    id: object.id,
    sevdeskId: object.id,
    kind,
    number: object.invoiceNumber || null,
    sevdeskContactId: customerId,
    contactName: object.addressName?.trim() || 'Unbekannter Kunde',
    subject: object.header?.trim() || null,
    invoiceDate,
    dueDate: kind === 'invoice' && Number.isFinite(timeToPay) ? addDays(invoiceDate, timeToPay) : null,
    paidAt: toDateOnly(object.payDate),
    status,
    originalInvoiceId: object.origin?.objectName === 'Invoice' ? object.origin.id : null,
    currency,
    netCents: isForeign ? toCents(object.sumNetForeignCurrency) : netEurCents,
    grossCents: isForeign ? toCents(object.sumGrossForeignCurrency) : grossEurCents,
    netEurCents,
    grossEurCents,
    paidEurCents: toCents(object.paidAmount),
    sevdeskUpdatedAt: object.update ? new Date(object.update) : null,
  }
}
