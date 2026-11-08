import { describe, expect, it } from 'vitest'
import { readCompanySubmission } from '@/lib/companies/read-company-submission'

const form = (entries: Record<string, string>) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(entries)) data.set(key, value)
  return data
}

describe('readCompanySubmission', () => {
  it('keeps an existing company id', () => {
    expect(readCompanySubmission(form({ companyId: 'company-1' }))).toEqual({
      kind: 'existing',
      companyId: 'company-1',
    })
  })

  it('attaches nothing when the contact has no company', () => {
    expect(readCompanySubmission(form({}))).toEqual({ kind: 'none' })
  })

  it('reads a new company created with the contact and ignores a phone field', () => {
    expect(readCompanySubmission(form({
      newCompany: 'true',
      companyId: 'ignored',
      name: 'Drehimpuls',
      logoUrl: 'https://example.com/logo.png',
      website: 'https://drehimpuls.de',
      street: 'Hafen 1',
      postalCode: '28195',
      city: 'Bremen',
      country: 'Deutschland',
      phone: '+49 123',
    }))).toEqual({
      kind: 'new',
      value: {
        name: 'Drehimpuls',
        logoUrl: 'https://example.com/logo.png',
        website: 'https://drehimpuls.de/',
        street: 'Hafen 1',
        postalCode: '28195',
        city: 'Bremen',
        country: 'Deutschland',
      },
    })
  })

  it('rejects a new company website that is not https', () => {
    expect(readCompanySubmission(form({
      newCompany: 'true',
      name: 'Drehimpuls',
      website: 'http://drehimpuls.de',
    }))).toEqual({ kind: 'invalid', message: 'Website muss eine https-URL sein.' })
  })
})
