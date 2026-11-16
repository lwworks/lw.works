import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { invoice } from '@/lib/db/schema/finance'
import { notInArray } from 'drizzle-orm'

/** Deletes invoices that are gone from SevDesk (deleted drafts, skipped types). */
export const deleteInvoicesExcept = (ids: string[]) => getDb().delete(invoice).where(notInArray(invoice.id, ids))
