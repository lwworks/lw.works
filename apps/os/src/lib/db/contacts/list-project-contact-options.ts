import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { contact } from '@/lib/db/schema/crm'
import { and, asc, eq, inArray, isNotNull, isNull } from 'drizzle-orm'

/**
 * Contacts that can be a project's contact person: not private, not deleted, and at a company
 * (only `companyId` when given, only `ids` when given).
 */
export const listProjectContactOptions = async ({ companyId, ids }: { companyId?: string; ids?: readonly string[] } = {}) => {
  await requireUserId()
  if (ids && ids.length === 0) return []
  return getDb()
    .select({ id: contact.id, companyId: contact.companyId, firstName: contact.firstName, lastName: contact.lastName })
    .from(contact)
    .where(
      and(
        isNull(contact.deletedAt),
        eq(contact.isPrivate, false),
        companyId ? eq(contact.companyId, companyId) : isNotNull(contact.companyId),
        ids ? inArray(contact.id, [...ids]) : undefined,
      ),
    )
    .orderBy(asc(contact.lastName), asc(contact.firstName))
}

export type ProjectContactOption = Awaited<ReturnType<typeof listProjectContactOptions>>[number]
