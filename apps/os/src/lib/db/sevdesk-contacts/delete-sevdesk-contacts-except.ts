import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { sevdeskContact } from '@/lib/db/schema/finance'
import { notInArray } from 'drizzle-orm'

/** Deletes customers that are gone from SevDesk; linked companies and invoices lose the reference. */
export const deleteSevdeskContactsExcept = (ids: string[]) => getDb().delete(sevdeskContact).where(notInArray(sevdeskContact.id, ids))
