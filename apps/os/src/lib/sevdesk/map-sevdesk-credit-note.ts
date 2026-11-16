import { creditNoteRowId } from '@/lib/sevdesk/credit-note-row-id'
import type { SevdeskInvoiceRow } from '@/lib/sevdesk/sevdesk-invoice-row'
import { SEVDESK_STATUSES } from '@/lib/sevdesk/sevdesk-statuses'
import { toCents } from '@/lib/sevdesk/to-cents'
import { toDateOnly } from '@/lib/sevdesk/to-date-only'
import type { SevdeskCreditNoteObject } from '@/lib/sevdesk/types'

/** SevDesk credit note → `invoice` row with negative amounts (SevDesk sends them positive), or null if unusable. */
export const mapSevdeskCreditNote = (object: SevdeskCreditNoteObject, customerIdByContactId: ReadonlyMap<string, string>): SevdeskInvoiceRow | null => {
  const status = SEVDESK_STATUSES[object.status]
  const invoiceDate = toDateOnly(object.creditNoteDate)
  if (!status || !invoiceDate) return null

  const currency = object.currency || 'EUR'
  const isForeign = currency !== 'EUR'
  const negative = (cents: number) => -Math.abs(cents)
  const netEurCents = negative(toCents(object.sumNet))
  const grossEurCents = negative(toCents(object.sumGross))

  return {
    id: creditNoteRowId(object.id),
    sevdeskId: object.id,
    kind: 'credit_note',
    number: object.creditNoteNumber || null,
    sevdeskContactId: object.contact ? (customerIdByContactId.get(object.contact.id) ?? null) : null,
    contactName: object.addressName?.trim() || 'Unbekannter Kunde',
    subject: object.header?.trim() || null,
    invoiceDate,
    dueDate: null,
    paidAt: toDateOnly(object.payDate),
    status,
    originalInvoiceId: object.refSrcInvoice?.objectName === 'Invoice' ? object.refSrcInvoice.id : null,
    currency,
    netCents: isForeign ? negative(toCents(object.sumNetForeignCurrency)) : netEurCents,
    grossCents: isForeign ? negative(toCents(object.sumGrossForeignCurrency)) : grossEurCents,
    netEurCents,
    grossEurCents,
    paidEurCents: 0,
    sevdeskUpdatedAt: object.update ? new Date(object.update) : null,
  }
}
