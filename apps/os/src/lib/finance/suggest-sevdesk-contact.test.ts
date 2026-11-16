import { normalizeCompanyName } from '@/lib/finance/normalize-company-name'
import { suggestSevdeskContact } from '@/lib/finance/suggest-sevdesk-contact'
import { describe, expect, it } from 'vitest'

describe('normalizeCompanyName', () => {
  it.each([
    ['LMB GmbH & Co. KG', 'lmb'],
    ['Aue Immobilien Kontor GmbH & Co. KG', 'aue immobilien kontor'],
    ['Müller e.K.', 'muller'],
    ['Studio XY UG (haftungsbeschränkt)', 'studio xy'],
  ])('%s → %s', (input, output) => {
    expect(normalizeCompanyName(input)).toBe(output)
  })
})

describe('suggestSevdeskContact', () => {
  const contacts = [
    { id: '1', name: 'LMB GmbH & Co. KG', companyId: null },
    { id: '2', name: 'Autohaus Brunkhorst GmbH', companyId: null },
    { id: '3', name: 'Lukas Brunkhorst', companyId: null },
    { id: '4', name: 'Hollegien & Hollegien GbR', companyId: 'c-1' },
  ]

  it('prefers the same normalized name', () => {
    expect(suggestSevdeskContact('LMB', contacts)?.id).toBe('1')
    expect(suggestSevdeskContact('Autohaus Brunkhorst', contacts)?.id).toBe('2')
  })

  it('falls back to a unique partial match', () => {
    expect(suggestSevdeskContact('Autohaus Brunkhorst Zeven', contacts)?.id).toBe('2')
  })

  it('does not guess when several match', () => {
    expect(suggestSevdeskContact('Brunkhorst', contacts)).toBeNull()
  })

  it('skips customers that are already linked', () => {
    expect(suggestSevdeskContact('Hollegien & Hollegien', contacts)).toBeNull()
  })
})
