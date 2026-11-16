import { sql } from 'drizzle-orm'
import { check, date, index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

const timestamptz = (name: string) => timestamp(name, { withTimezone: true })

/**
 * A customer in SevDesk: the topmost contact (an organisation, or a person without one). Invoices addressed to a
 * person of an organisation belong to the organisation. Written only by the sync; `id` is the SevDesk ID.
 */
export const sevdeskContact = pgTable('sevdesk_contact', {
  id: text('id').primaryKey(),
  customerNumber: text('customer_number'),
  name: text('name').notNull(),
  syncedAt: timestamptz('synced_at').notNull(),
})

export type InvoiceKind = 'invoice' | 'cancellation' | 'credit_note'
/** `cancelled`: an invoice a cancellation (`SR`) points to; SevDesk itself keeps it at "paid". */
export type InvoiceStatus = 'draft' | 'open' | 'partially_paid' | 'paid' | 'cancelled'

/**
 * Invoices, cancellations and credit notes from SevDesk, written only by the sync.
 * `id` is the SevDesk invoice ID, or `cn-<id>` for credit notes (a separate SevDesk table).
 * Amounts are cents; cancellations and credit notes are negative. `*_eur_cents` are SevDesk's own EUR amounts,
 * `net_cents`/`gross_cents` are in `currency`. Dates are calendar days as SevDesk shows them.
 */
export const invoice = pgTable(
  'invoice',
  {
    id: text('id').primaryKey(),
    sevdeskId: text('sevdesk_id').notNull(),
    kind: text('kind').$type<InvoiceKind>().notNull(),
    number: text('number'),
    sevdeskContactId: text('sevdesk_contact_id').references(() => sevdeskContact.id, { onDelete: 'set null' }),
    contactName: text('contact_name').notNull(),
    subject: text('subject'),
    invoiceDate: date('invoice_date', { mode: 'string' }).notNull(),
    dueDate: date('due_date', { mode: 'string' }),
    paidAt: date('paid_at', { mode: 'string' }),
    status: text('status').$type<InvoiceStatus>().notNull(),
    /** For cancellations and credit notes: the invoice they refer to (local ID, no FK; it may be gone). */
    originalInvoiceId: text('original_invoice_id'),
    currency: text('currency').notNull(),
    netCents: integer('net_cents').notNull(),
    grossCents: integer('gross_cents').notNull(),
    netEurCents: integer('net_eur_cents').notNull(),
    grossEurCents: integer('gross_eur_cents').notNull(),
    paidEurCents: integer('paid_eur_cents').default(0).notNull(),
    sevdeskUpdatedAt: timestamptz('sevdesk_updated_at'),
    syncedAt: timestamptz('synced_at').notNull(),
  },
  (table) => [
    index('invoice_date_idx').on(table.invoiceDate),
    index('invoice_contact_date_idx').on(table.sevdeskContactId, table.invoiceDate),
    index('invoice_status_idx').on(table.status),
    check('invoice_kind', sql`${table.kind} IN ('invoice', 'cancellation', 'credit_note')`),
    check('invoice_status', sql`${table.status} IN ('draft', 'open', 'partially_paid', 'paid', 'cancelled')`),
  ],
)

/** Single row (`id = 'default'`): last SevDesk sync and the lock against overlapping runs. */
export const sevdeskSyncState = pgTable('sevdesk_sync_state', {
  id: text('id').primaryKey(),
  lockedUntil: timestamptz('locked_until'),
  lastSyncedAt: timestamptz('last_synced_at'),
  lastError: text('last_error'),
  updatedAt: timestamptz('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export type Invoice = typeof invoice.$inferSelect
export type SevdeskContact = typeof sevdeskContact.$inferSelect
