import type { SevdeskContactObject } from '@/lib/sevdesk/types'

const MAX_DEPTH = 5

const contactName = (contact: SevdeskContactObject) =>
  contact.name?.trim() || [contact.surename, contact.familyname].filter(Boolean).join(' ').trim() || 'Unbenannter Kontakt'

/**
 * Customers are the topmost contacts: organisations, and persons without one. Returns them and, for every contact,
 * the customer it belongs to (a person of an organisation → the organisation).
 */
export const resolveSevdeskCustomers = (contacts: SevdeskContactObject[]) => {
  const byId = new Map(contacts.map((contact) => [contact.id, contact]))
  const rootOf = (contact: SevdeskContactObject) => {
    let current = contact
    for (let depth = 0; depth < MAX_DEPTH && current.parent; depth++) {
      const parent = byId.get(current.parent.id)
      if (!parent) break
      current = parent
    }
    return current
  }

  const customerIdByContactId = new Map<string, string>()
  const customers = new Map<string, { id: string; name: string; customerNumber: string | null }>()
  for (const contact of contacts) {
    const root = rootOf(contact)
    customerIdByContactId.set(contact.id, root.id)
    if (!customers.has(root.id)) customers.set(root.id, { id: root.id, name: contactName(root), customerNumber: root.customerNumber || null })
  }
  return { customers: [...customers.values()], customerIdByContactId }
}
