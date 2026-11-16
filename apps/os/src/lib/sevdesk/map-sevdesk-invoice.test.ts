import { mapSevdeskInvoice } from '@/lib/sevdesk/map-sevdesk-invoice'
import type { SevdeskInvoiceObject } from '@/lib/sevdesk/types'
import { describe, expect, it } from 'vitest'

const base: SevdeskInvoiceObject = {
  id: '139549130',
  contact: { id: 'person-1', objectName: 'Contact' },
  update: '2026-11-16T17:09:03+01:00',
  header: 'Shopware-Update',
  addressName: 'Sandra Hollegien | Hollegien & Hollegien GbR',
  status: '200',
  currency: 'EUR',
  payDate: null,
  sumNet: '1440',
  sumGross: '1713.6',
  sumNetForeignCurrency: '0',
  sumGrossForeignCurrency: '0',
  invoiceNumber: 'R#26068',
  invoiceDate: '2026-11-16T00:00:00+01:00',
  invoiceType: 'RE',
  timeToPay: '14',
  paidAmount: 0,
}
const customers = new Map([['person-1', 'org-1']])

describe('mapSevdeskInvoice', () => {
  it('maps an open EUR invoice to its customer, with the due date', () => {
    expect(mapSevdeskInvoice(base, customers)).toMatchObject({
      id: '139549130',
      kind: 'invoice',
      number: 'R#26068',
      sevdeskContactId: 'org-1',
      invoiceDate: '2026-11-16',
      dueDate: '2026-11-30',
      status: 'open',
      currency: 'EUR',
      netCents: 144000,
      grossCents: 171360,
      netEurCents: 144000,
      grossEurCents: 171360,
      paidAt: null,
    })
  })

  it('keeps the original amount of a foreign-currency invoice next to the EUR amount', () => {
    const row = mapSevdeskInvoice(
      { ...base, currency: 'USD', status: '1000', sumNet: '10918.91', sumGross: '10918.91', sumNetForeignCurrency: '12770', sumGrossForeignCurrency: '12770', payDate: '2025-12-22T00:00:00+01:00', paidAmount: 10918.91 },
      customers,
    )
    expect(row).toMatchObject({ currency: 'USD', netCents: 1277000, netEurCents: 1091891, status: 'paid', paidAt: '2025-12-22', paidEurCents: 1091891 })
  })

  it('maps a cancellation with negative amounts and its original invoice', () => {
    const row = mapSevdeskInvoice({ ...base, invoiceType: 'SR', status: '1000', sumNet: '-163.45', sumGross: '-194.51', origin: { id: '122700706', objectName: 'Invoice' } }, customers)
    expect(row).toMatchObject({ kind: 'cancellation', netEurCents: -16345, originalInvoiceId: '122700706', dueDate: null })
  })

  it('ignores an origin that is not an invoice', () => {
    expect(mapSevdeskInvoice({ ...base, origin: { id: '1', objectName: 'Order' } }, customers)?.originalInvoiceId).toBeNull()
  })

  it('skips dunning letters, recurring templates and unknown statuses', () => {
    expect(mapSevdeskInvoice({ ...base, invoiceType: 'MA' }, customers)).toBeNull()
    expect(mapSevdeskInvoice({ ...base, invoiceType: 'WKR' }, customers)).toBeNull()
    expect(mapSevdeskInvoice({ ...base, status: '50' }, customers)).toBeNull()
  })

  it('maps drafts and leaves the customer empty when the contact is unknown', () => {
    expect(mapSevdeskInvoice({ ...base, status: '100', contact: { id: 'gone', objectName: 'Contact' } }, customers)).toMatchObject({ status: 'draft', sevdeskContactId: null })
  })
})
