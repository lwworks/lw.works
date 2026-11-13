import { describe, expect, it } from 'vitest'
import { toContactPrefill } from './to-contact-prefill'

const card = {
  firstName: 'Anna',
  lastName: 'Schmidt',
  email: 'anna@beispiel.de',
  phone: '+49 421 123456',
  mobile: null,
  linkedIn: null,
  instagram: null,
  x: null,
  company: { name: 'Beispiel GmbH', website: 'https://beispiel.de', street: 'Hauptstr. 1', postalCode: '28195', city: 'Bremen', country: 'Deutschland' },
}

describe('toContactPrefill', () => {
  it('matches an existing company regardless of legal form and case', () => {
    const prefill = toContactPrefill(card, [{ id: 'c1', name: 'beispiel' }])
    expect(prefill.company).toEqual({ kind: 'existing', id: 'c1', name: 'beispiel' })
  })

  it('prefills a new company with the address from the card', () => {
    const prefill = toContactPrefill(card, [{ id: 'c1', name: 'Andere AG' }])
    expect(prefill.company).toEqual({
      kind: 'new',
      fields: { name: 'Beispiel GmbH', website: 'https://beispiel.de', street: 'Hauptstr. 1', postalCode: '28195', city: 'Bremen', country: 'Deutschland' },
    })
  })

  it('keeps mobile and landline, mobile first', () => {
    expect(toContactPrefill({ ...card, mobile: '+49 171 1' }, []).phones).toEqual([
      { value: '+49 171 1', type: 'mobile' },
      { value: '+49 421 123456', type: 'work' },
    ])
    expect(toContactPrefill(card, []).phones).toEqual([{ value: '+49 421 123456', type: 'work' }])
    expect(toContactPrefill(card, []).emails).toEqual([{ value: 'anna@beispiel.de', type: 'work' }])
  })

  it('leaves the company empty when the card has none', () => {
    expect(toContactPrefill({ ...card, company: null }, []).company).toBeNull()
    expect(toContactPrefill({ ...card, company: { ...card.company, name: ' ' } }, []).company).toBeNull()
  })
})
