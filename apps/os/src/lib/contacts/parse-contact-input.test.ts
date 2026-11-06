import { describe, expect, it } from 'vitest'
import { parseContactInput } from '@/lib/contacts/parse-contact-input'

describe('parseContactInput', () => {
  it('requires a first or last name and ignores a role', () => {
    const missing = new FormData()
    expect(parseContactInput(missing)).toEqual({ ok: false, message: 'Vorname oder Nachname ist erforderlich.' })

    const form = new FormData()
    form.set('lastName', 'Nienaber')
    form.set('role', 'Berater')
    form.append('tagIds', 'tag-1')
    form.append('tagIds', 'tag-1')
    const parsed = parseContactInput(form)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.value.lastName).toBe('Nienaber')
    expect(parsed.value.firstName).toBe('')
    expect(parsed.value.tagIds).toEqual(['tag-1'])
    expect(parsed.value.isPrivate).toBe(false)
    expect(parsed.value).not.toHaveProperty('role')
  })

  it('rejects an impossible birthday', () => {
    const form = new FormData()
    form.set('firstName', 'Ada')
    form.set('birthdayMonth', '2')
    form.set('birthdayDay', '31')
    expect(parseContactInput(form).ok).toBe(false)
  })
})
