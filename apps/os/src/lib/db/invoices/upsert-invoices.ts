import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { invoice } from '@/lib/db/schema/finance'
import type { SevdeskInvoiceRow } from '@/lib/sevdesk/sevdesk-invoice-row'
import { getTableColumns, sql } from 'drizzle-orm'

const CHUNK_SIZE = 100

// Every column except the key takes the incoming value.
const updateSet = Object.fromEntries(
  Object.entries(getTableColumns(invoice))
    .filter(([key]) => key !== 'id')
    .map(([key, column]) => [key, sql.raw(`excluded."${column.name}"`)]),
)

/** Inserts or updates invoices by ID. Also used for single invoices. */
export const upsertInvoices = async (rows: SevdeskInvoiceRow[], syncedAt: Date) => {
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    await getDb()
      .insert(invoice)
      .values(rows.slice(i, i + CHUNK_SIZE).map((row) => ({ ...row, syncedAt })))
      .onConflictDoUpdate({ target: invoice.id, set: updateSet })
  }
}
