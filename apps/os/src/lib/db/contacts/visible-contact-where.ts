import 'server-only'

import { contact } from '@/lib/db/schema/crm'
import { and, eq, isNull, or } from 'drizzle-orm'

/** Non-deleted, and private only for the creator. `userId` comes from `requireUserId`, never from the client. */
export const visibleContactWhere = (userId: string) =>
  and(isNull(contact.deletedAt), or(eq(contact.isPrivate, false), eq(contact.createdByUserId, userId)))
