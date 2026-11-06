import { describe, expect, it } from 'vitest'
import { parseCompanyInput } from '@/lib/companies/parse-company-input'

const form = (entries: Record<string, string>) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(entries)) data.set(key, value)
  return data
}

describe('parseCompanyInput', () => {
  it('keeps name, logo, address, and website and has no phone', () => {
    const parsed = parseCompanyInput(form({
      name: 'Drehimpuls',
      logoUrl: 'https://example.com/logo.png',
      website: 'https://drehimpuls.de',
      street: 'Hafen 1',
      postalCode: '28195',
      city: 'Bremen',
      country: 'Deutschland',
      phone: '+49 123',
    }))
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.value).toEqual({
      name: 'Drehimpuls',
      logoUrl: 'https://example.com/logo.png',
      website: 'https://drehimpuls.de/',
      street: 'Hafen 1',
      postalCode: '28195',
      city: 'Bremen',
      country: 'Deutschland',
    })
    expect(parsed.value).not.toHaveProperty('phone')
  })

  it('rejects a logo that is not https', () => {
    const parsed = parseCompanyInput(form({ name: 'Drehimpuls', logoUrl: 'http://example.com/logo.png' }))
    expect(parsed).toEqual({ ok: false, message: 'Logo muss eine https-URL sein.' })
  })
})
