import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import type { ContactInput } from '@/lib/contacts/parse-contact-input'
import { visibleContactWhere } from '@/lib/db/contacts/visible-contact-where'
import { getDb } from '@/lib/db/get-db'
import { company, contact, contactTag, tag } from '@/lib/db/schema/crm'
import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'
import { and, asc, eq } from 'drizzle-orm'

export type ContactDetail = ContactInput & {
  id: string
  displayId: number
  createdByUserId: string
  canEditPrivacy: boolean
  syncedFieldsEditedAt: Date | null
  lastInboundAt: Date | null
  company: { id: string; name: string; logoUrl: string | null } | null
  tags: { id: string; name: string; color: string }[]
}

/** One visible contact, or null when it is missing, deleted, or private to someone else. */
export const getVisibleContact = async (displayId: number): Promise<ContactDetail | null> => {
  const userId = await requireUserId()
  const [row] = await getDb()
    .select({
      id: contact.id,
      displayId: contact.displayId,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      whatsApp: contact.whatsApp,
      linkedIn: contact.linkedIn,
      instagram: contact.instagram,
      x: contact.x,
      avatarUrl: contact.avatarUrl,
      birthdayMonth: contact.birthdayMonth,
      birthdayDay: contact.birthdayDay,
      birthdayYear: contact.birthdayYear,
      isPrivate: contact.isPrivate,
      companyId: contact.companyId,
      createdByUserId: contact.createdByUserId,
      syncedFieldsEditedAt: contact.syncedFieldsEditedAt,
      lastInboundAt: contact.lastInboundAt,
      companyName: company.name,
      companyLogoUrl: company.logoUrl,
    })
    .from(contact)
    .leftJoin(company, eq(contact.companyId, company.id))
    .where(and(eq(contact.displayId, displayId), visibleContactWhere(userId)))
    .limit(1)
  if (!row) return null

  const tags = await getDb()
    .select({ id: tag.id, name: tag.name, color: tag.color })
    .from(contactTag)
    .innerJoin(tag, eq(contactTag.tagId, tag.id))
    .where(eq(contactTag.contactId, row.id))
    .orderBy(asc(tag.name))

  const birthday: SyncedContactFields['birthday'] =
    row.birthdayMonth && row.birthdayDay
      ? { month: row.birthdayMonth, day: row.birthdayDay, ...(row.birthdayYear ? { year: row.birthdayYear } : {}) }
      : null

  return {
    id: row.id,
    displayId: row.displayId,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    whatsApp: row.whatsApp,
    linkedIn: row.linkedIn,
    instagram: row.instagram,
    x: row.x,
    avatarUrl: row.avatarUrl,
    birthday,
    companyId: row.companyId,
    tagIds: tags.map((item) => item.id),
    isPrivate: row.isPrivate,
    createdByUserId: row.createdByUserId,
    canEditPrivacy: row.createdByUserId === userId,
    syncedFieldsEditedAt: row.syncedFieldsEditedAt,
    lastInboundAt: row.lastInboundAt,
    company: row.companyId ? { id: row.companyId, name: row.companyName ?? '', logoUrl: row.companyLogoUrl } : null,
    tags,
  }
}
