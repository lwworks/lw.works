import type { BusinessCard } from '@/lib/business-card/extract-business-card'

export type CompanyPrefill =
  | { kind: 'existing'; id: string; name: string }
  | { kind: 'new'; fields: { name: string; website: string; street: string; postalCode: string; city: string; country: string } }

export type ContactPrefill = {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  linkedIn: string | null
  instagram: string | null
  x: string | null
  company: CompanyPrefill | null
}

const normalize = (name: string) =>
  name
    .toLocaleLowerCase('de')
    .replace(/\b(gmbh|ag|kg|ug|e\.?\s?k\.?|mbh|co\.?|&|inc\.?|ltd\.?|llc)\b/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '')

/** Maps a read business card to new-contact form values. The mobile number wins over the landline; the company is matched to an existing one by name. */
export const toContactPrefill = (card: BusinessCard, companies: { id: string; name: string }[]): ContactPrefill => {
  let company: CompanyPrefill | null = null
  const companyName = card.company?.name?.trim()
  if (card.company && companyName) {
    const key = normalize(companyName)
    const match = key ? companies.find((existing) => normalize(existing.name) === key) : undefined
    company = match
      ? { kind: 'existing', id: match.id, name: match.name }
      : {
          kind: 'new',
          fields: {
            name: companyName,
            website: card.company.website ?? '',
            street: card.company.street ?? '',
            postalCode: card.company.postalCode ?? '',
            city: card.company.city ?? '',
            country: card.company.country ?? '',
          },
        }
  }
  return {
    firstName: card.firstName ?? '',
    lastName: card.lastName ?? '',
    email: card.email,
    phone: card.mobile ?? card.phone,
    linkedIn: card.linkedIn,
    instagram: card.instagram,
    x: card.x,
    company,
  }
}
