import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { user } from '@/lib/db/schema/auth'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm'

export type ProjectTimeEntriesView = 'open' | 'billed'

const BILLED_LIMIT = 200

/**
 * The project's live entries of all users, newest first: every open (not yet billed) entry, or the most recent billed ones.
 * `isOwn` marks the signed-in user's; only those carry the calendar link.
 */
export const listProjectTimeEntries = async (projectId: string, view: ProjectTimeEntriesView) => {
  const userId = await requireUserId()
  const query = getDb()
    .select({
      id: timeEntry.id,
      title: timeEntry.title,
      startAt: timeEntry.startAt,
      endAt: timeEntry.endAt,
      htmlLink: timeEntry.htmlLink,
      billedAt: timeEntry.billedAt,
      invoiceNumber: timeEntry.invoiceNumber,
      userId: timeEntry.userId,
      userName: user.name,
    })
    .from(timeEntry)
    .innerJoin(user, eq(user.id, timeEntry.userId))
    .where(and(eq(timeEntry.projectId, projectId), isNull(timeEntry.deletedAt), view === 'open' ? isNull(timeEntry.billedAt) : isNotNull(timeEntry.billedAt)))
    .orderBy(desc(timeEntry.startAt))
  const rows = view === 'billed' ? await query.limit(BILLED_LIMIT) : await query
  return rows.map(({ userId: ownerId, htmlLink, ...row }) => {
    const isOwn = ownerId === userId
    return { ...row, isOwn, htmlLink: isOwn ? htmlLink : null }
  })
}

export type ProjectTimeEntry = Awaited<ReturnType<typeof listProjectTimeEntries>>[number]
