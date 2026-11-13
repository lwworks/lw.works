import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { user } from '@/lib/db/schema/auth'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { and, desc, eq, isNull } from 'drizzle-orm'

/** The project's most recent live entries of all users. `isOwn` marks the signed-in user's; only those carry the calendar link. */
export const listProjectTimeEntries = async (projectId: string, limit = 50) => {
  const userId = await requireUserId()
  const rows = await getDb()
    .select({
      id: timeEntry.id,
      title: timeEntry.title,
      startAt: timeEntry.startAt,
      endAt: timeEntry.endAt,
      htmlLink: timeEntry.htmlLink,
      userId: timeEntry.userId,
      userName: user.name,
    })
    .from(timeEntry)
    .innerJoin(user, eq(user.id, timeEntry.userId))
    .where(and(eq(timeEntry.projectId, projectId), isNull(timeEntry.deletedAt)))
    .orderBy(desc(timeEntry.startAt))
    .limit(limit)
  return rows.map(({ userId: ownerId, htmlLink, ...row }) => {
    const isOwn = ownerId === userId
    return { ...row, isOwn, htmlLink: isOwn ? htmlLink : null }
  })
}

export type ProjectTimeEntry = Awaited<ReturnType<typeof listProjectTimeEntries>>[number]
