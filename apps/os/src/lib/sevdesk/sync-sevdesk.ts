import 'server-only'

import { deleteInvoicesExcept } from '@/lib/db/invoices/delete-invoices-except'
import { upsertInvoices } from '@/lib/db/invoices/upsert-invoices'
import { deleteSevdeskContactsExcept } from '@/lib/db/sevdesk-contacts/delete-sevdesk-contacts-except'
import { upsertSevdeskContacts } from '@/lib/db/sevdesk-contacts/upsert-sevdesk-contacts'
import { finishSevdeskSyncState } from '@/lib/db/sevdesk-sync-states/finish-sevdesk-sync-state'
import { lockSevdeskSyncState } from '@/lib/db/sevdesk-sync-states/lock-sevdesk-sync-state'
import { applyCancellations } from '@/lib/sevdesk/apply-cancellations'
import { listSevdeskObjects } from '@/lib/sevdesk/list-sevdesk-objects'
import { mapSevdeskCreditNote } from '@/lib/sevdesk/map-sevdesk-credit-note'
import { mapSevdeskInvoice } from '@/lib/sevdesk/map-sevdesk-invoice'
import { resolveSevdeskCustomers } from '@/lib/sevdesk/resolve-sevdesk-customers'
import { SevdeskError } from '@/lib/sevdesk/sevdesk-error'
import type { SevdeskContactObject, SevdeskCreditNoteObject, SevdeskInvoiceObject } from '@/lib/sevdesk/types'

export type SevdeskSyncResult =
  | { status: 'ok'; customers: number; invoices: number }
  | { status: 'locked' }
  | { status: 'error'; error: string }

/**
 * Full SevDesk → OS sync: customers, invoices and credit notes are upserted, and whatever SevDesk no longer has is
 * deleted. A full run is cheap at a few hundred documents and needs no change tracking. One run at a time.
 */
export const syncSevdesk = async (): Promise<SevdeskSyncResult> => {
  if (!(await lockSevdeskSyncState())) return { status: 'locked' }

  try {
    const [contacts, invoices, creditNotes] = await Promise.all([
      listSevdeskObjects<SevdeskContactObject>('/Contact', 'depth=1'),
      listSevdeskObjects<SevdeskInvoiceObject>('/Invoice'),
      listSevdeskObjects<SevdeskCreditNoteObject>('/CreditNote'),
    ])
    const { customers, customerIdByContactId } = resolveSevdeskCustomers(contacts)
    const rows = applyCancellations([
      ...invoices.map((object) => mapSevdeskInvoice(object, customerIdByContactId)),
      ...creditNotes.map((object) => mapSevdeskCreditNote(object, customerIdByContactId)),
    ].filter((row) => row !== null))

    const syncedAt = new Date()
    await upsertSevdeskContacts(customers, syncedAt)
    await upsertInvoices(rows, syncedAt)
    await deleteInvoicesExcept(rows.map((row) => row.id))
    await deleteSevdeskContactsExcept(customers.map((customer) => customer.id))
    await finishSevdeskSyncState({ syncedAt })
    return { status: 'ok', customers: customers.length, invoices: rows.length }
  } catch (error) {
    const message = error instanceof SevdeskError ? error.message : 'SevDesk-Sync fehlgeschlagen.'
    console.error('SevDesk sync failed:', error instanceof SevdeskError ? error.message : error)
    await finishSevdeskSyncState({ error: message })
    return { status: 'error', error: message }
  }
}
