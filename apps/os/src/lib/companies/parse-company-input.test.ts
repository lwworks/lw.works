import { describe, expect, it } from 'vitest'
import { parseCompanyInput } from '@/lib/companies/parse-company-input'

const form = (entries: [string, string][]) => {
  const data = new FormData()
  for (const [key, value] of entries) data.append(key, value)
  return data
}

describe('parseCompanyInput', () => {
  it('keeps name, logo, website, and a location, and has no phone', () => {
    const parsed = parseCompanyInput(form([
      ['name', 'Drehimpuls'],
      ['logoUrl', 'https://example.com/logo.png'],
      ['website', 'https://drehimpuls.de'],
      ['street', 'Hafen 1'],
      ['postalCode', '28195'],
      ['city', 'Bremen'],
      ['country', 'Deutschland'],
      ['phone', '+49 123'],
    ]))
    expect(parsed).toEqual({
      ok: true,
      value: {
        name: 'Drehimpuls',
        logoUrl: 'https://example.com/logo.png',
        website: 'https://drehimpuls.de',
        locations: [{ id: null, label: null, street: 'Hafen 1', postalCode: '28195', city: 'Bremen', country: 'Deutschland' }],
      },
    })
    if (parsed.ok) expect(parsed.value).not.toHaveProperty('phone')
  })

  it('reads several locations by position and drops empty ones', () => {
    const parsed = parseCompanyInput(form([
      ['name', 'Drehimpuls'],
      ['locationId', 'loc-1'], ['locationLabel', 'Hauptsitz'], ['street', 'Hafen 1'], ['postalCode', '28195'], ['city', 'Bremen'], ['country', ''],
      ['locationId', ''], ['locationLabel', ''], ['street', ''], ['postalCode', ''], ['city', ''], ['country', ''],
      ['locationId', ''], ['locationLabel', 'Büro Hamburg'], ['street', ''], ['postalCode', ''], ['city', 'Hamburg'], ['country', ''],
    ]))
    expect(parsed.ok && parsed.value.locations).toEqual([
      { id: 'loc-1', label: 'Hauptsitz', street: 'Hafen 1', postalCode: '28195', city: 'Bremen', country: null },
      { id: null, label: 'Büro Hamburg', street: null, postalCode: null, city: 'Hamburg', country: null },
    ])
  })

  it('stores logo and website as entered, including values that are not https urls', () => {
    const parsed = parseCompanyInput(form([
      ['name', 'Drehimpuls'],
      ['logoUrl', 'http://example.com/logo.png'],
      ['website', 'autor@-brunkhorst.de'],
    ]))
    expect(parsed).toEqual({
      ok: true,
      value: { name: 'Drehimpuls', logoUrl: 'http://example.com/logo.png', website: 'autor@-brunkhorst.de', locations: [] },
    })
  })

  it('requires a name', () => {
    expect(parseCompanyInput(form([['city', 'Bremen']]))).toEqual({ ok: false, message: 'Name ist erforderlich.' })
  })
})
