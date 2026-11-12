import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { visibleContactWhere } from '@/lib/db/contacts/visible-contact-where'
import { getDb } from '@/lib/db/get-db'
import { company, contact, contactTag, tag } from '@/lib/db/schema/crm'
import { asc, eq, inArray } from 'drizzle-orm'

export type ContactListItem = {
  displayId: number
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  whatsApp: string | null
  avatarUrl: string | null
  company: { id: string; name: string; logoKey: string | null } | null
  tags: { id: string; name: string; color: string }[]
}

/** Contacts the signed-in user may see, with company and tags. */
export const listVisibleContacts = async (): Promise<ContactListItem[]> => {
  const userId = await requireUserId()
  const rows = await getDb()
    .select({
      id: contact.id,
      displayId: contact.displayId,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      whatsApp: contact.whatsApp,
      avatarUrl: contact.avatarUrl,
      companyId: company.id,
      companyName: company.name,
      companyLogoKey: company.logoKey,
    })
    .from(contact)
    .leftJoin(company, eq(contact.companyId, company.id))
    .where(visibleContactWhere(userId))
    .orderBy(asc(contact.displayId))

  const tagsByContact = await tagsFor(rows.map((row) => row.id))
  return rows.map((row) => ({
    displayId: row.displayId,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    whatsApp: row.whatsApp,
    avatarUrl: row.avatarUrl,
    company: row.companyId ? { id: row.companyId, name: row.companyName ?? '', logoKey: row.companyLogoKey } : null,
    tags: tagsByContact.get(row.id) ?? [],
  }))
}

const tagsFor = async (contactIds: string[]) => {
  const grouped = new Map<string, ContactListItem['tags']>()
  if (contactIds.length === 0) return grouped
  const rows = await getDb()
    .select({ contactId: contactTag.contactId, id: tag.id, name: tag.name, color: tag.color })
    .from(contactTag)
    .innerJoin(tag, eq(contactTag.tagId, tag.id))
    .where(inArray(contactTag.contactId, contactIds))
    .orderBy(asc(tag.name))
  for (const row of rows) {
    const tags = grouped.get(row.contactId) ?? []
    tags.push({ id: row.id, name: row.name, color: row.color })
    grouped.set(row.contactId, tags)
  }
  return grouped
}
