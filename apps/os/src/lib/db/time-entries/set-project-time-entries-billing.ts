import 'server-only'

import { getDb } from '@/lib/db/get-db'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { and, eq, inArray, isNotNull, isNull } from 'drizzle-orm'

/**
 * Marks the project's live entries `ids` (of any user) as billed, or back to open with `billing: null`.
 * Only entries in the opposite state change, so marking twice keeps the first invoice. Returns the number of changed entries.
 */
export const setProjectTimeEntriesBilling = async (
  projectId: string,
  ids: readonly string[],
  billing: { billedAt: Date; invoiceNumber: string | null } | null,
) => {
  if (ids.length === 0) return 0
  const rows = await getDb()
    .update(timeEntry)
    .set(billing ?? { billedAt: null, invoiceNumber: null })
    .where(
      and(
        eq(timeEntry.projectId, projectId),
        inArray(timeEntry.id, [...ids]),
        isNull(timeEntry.deletedAt),
        billing ? isNull(timeEntry.billedAt) : isNotNull(timeEntry.billedAt),
      ),
    )
    .returning({ id: timeEntry.id })
  return rows.length
}
