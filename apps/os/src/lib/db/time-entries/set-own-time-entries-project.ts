import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { and, eq, inArray } from 'drizzle-orm'

/** Assigns the signed-in user's entries to `projectId` (or to no project) by hand; the sync keeps that. */
export const setOwnTimeEntriesProject = async (ids: readonly string[], projectId: string | null) => {
  const userId = await requireUserId()
  if (ids.length === 0) return
  await getDb()
    .update(timeEntry)
    .set({ projectId, projectAssignment: 'manual' })
    .where(and(eq(timeEntry.userId, userId), inArray(timeEntry.id, [...ids])))
}
