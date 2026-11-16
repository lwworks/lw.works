import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { sevdeskContact } from '@/lib/db/schema/finance'
import { sql } from 'drizzle-orm'

const CHUNK_SIZE = 200

/** Inserts or updates SevDesk customers by SevDesk ID. */
export const upsertSevdeskContacts = async (rows: { id: string; name: string; customerNumber: string | null }[], syncedAt: Date) => {
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    await getDb()
      .insert(sevdeskContact)
      .values(rows.slice(i, i + CHUNK_SIZE).map((row) => ({ ...row, syncedAt })))
      .onConflictDoUpdate({
        target: sevdeskContact.id,
        set: { name: sql`excluded.name`, customerNumber: sql`excluded.customer_number`, syncedAt: sql`excluded.synced_at` },
      })
  }
}
