import { getTableColumns } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { company, contact } from '@/lib/db/schema/crm'

describe('crm schema', () => {
  it('gives a company no phone and a contact no role', () => {
    expect(getTableColumns(company)).not.toHaveProperty('phone')
    expect(getTableColumns(contact)).not.toHaveProperty('role')
    expect(getTableColumns(contact).deletedAt).toBeDefined()
    expect(getTableColumns(contact).isPrivate).toBeDefined()
  })
})
