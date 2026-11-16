import { normalizeCompanyName } from '@/lib/finance/normalize-company-name'

/**
 * The SevDesk customer whose name best matches the company: same normalized name first, then one name containing
 * the other. Only unlinked customers; null without a unique best match.
 */
export const suggestSevdeskContact = <T extends { id: string; name: string; companyId: string | null }>(companyName: string, contacts: T[]) => {
  const target = normalizeCompanyName(companyName)
  if (!target) return null
  const candidates = contacts.filter((contact) => contact.companyId === null)
  const normalized = candidates.map((contact) => ({ contact, name: normalizeCompanyName(contact.name) }))

  const exact = normalized.filter(({ name }) => name === target)
  if (exact.length === 1) return exact[0].contact
  if (exact.length > 1) return null

  const partial = normalized.filter(({ name }) => name.length >= 3 && target.length >= 3 && (name.includes(target) || target.includes(name)))
  return partial.length === 1 ? partial[0].contact : null
}
