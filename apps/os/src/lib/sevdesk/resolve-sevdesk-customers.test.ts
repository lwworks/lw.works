import { resolveSevdeskCustomers } from '@/lib/sevdesk/resolve-sevdesk-customers'
import { describe, expect, it } from 'vitest'

const contact = (id: string, values: { name?: string; surename?: string; familyname?: string; customerNumber?: string; parent?: string }) => ({
  id,
  name: values.name ?? null,
  surename: values.surename ?? null,
  familyname: values.familyname ?? null,
  customerNumber: values.customerNumber ?? null,
  parent: values.parent ? { id: values.parent, objectName: 'Contact' } : null,
})

describe('resolveSevdeskCustomers', () => {
  const { customers, customerIdByContactId } = resolveSevdeskCustomers([
    contact('person', { surename: 'Sandra', familyname: 'Hollegien', customerNumber: 'K#7067', parent: 'org' }),
    contact('org', { name: 'Hollegien & Hollegien GbR', customerNumber: 'K#7067' }),
    contact('private', { surename: 'Lukas', familyname: 'Brunkhorst', customerNumber: 'K#7069' }),
    contact('orphan', { surename: 'Ohne', familyname: 'Firma', parent: 'missing' }),
  ])

  it('lists only topmost contacts as customers', () => {
    expect(customers).toEqual([
      { id: 'org', name: 'Hollegien & Hollegien GbR', customerNumber: 'K#7067' },
      { id: 'private', name: 'Lukas Brunkhorst', customerNumber: 'K#7069' },
      { id: 'orphan', name: 'Ohne Firma', customerNumber: null },
    ])
  })

  it('maps a person of an organisation to the organisation', () => {
    expect(customerIdByContactId.get('person')).toBe('org')
    expect(customerIdByContactId.get('org')).toBe('org')
    expect(customerIdByContactId.get('private')).toBe('private')
  })
})
