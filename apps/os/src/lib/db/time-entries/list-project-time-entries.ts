import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { user } from '@/lib/db/schema/auth'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { and, desc, eq, isNotNull, isNull, type SQL } from 'drizzle-orm'

export type ProjectTimeEntriesView = 'all' | 'open' | 'billed'

/** Billed entries pile up over time; open ones are what gets invoiced next, so they are never cut off. */
export const PROJECT_TIME_ENTRIES_LIMIT = 200

/**
 * The project's live entries of all users, newest first: every open (not yet billed) entry, or the most recent billed or all ones.
 * `isOwn` marks the signed-in user's; only those carry the calendar link.
 */
export const listProjectTimeEntries = async (projectId: string, view: ProjectTimeEntriesView) => {
  const userId = await requireUserId()
  const billingWhere: Record<ProjectTimeEntriesView, SQL | undefined> = {
    all: undefined,
    open: isNull(timeEntry.billedAt),
    billed: isNotNull(timeEntry.billedAt),
  }
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
    .where(and(eq(timeEntry.projectId, projectId), isNull(timeEntry.deletedAt), billingWhere[view]))
    .orderBy(desc(timeEntry.startAt))
  const rows = view === 'open' ? await query : await query.limit(PROJECT_TIME_ENTRIES_LIMIT)
  return rows.map(({ userId: ownerId, htmlLink, ...row }) => {
    const isOwn = ownerId === userId
    return { ...row, isOwn, htmlLink: isOwn ? htmlLink : null }
  })
}

export type ProjectTimeEntry = Awaited<ReturnType<typeof listProjectTimeEntries>>[number]
