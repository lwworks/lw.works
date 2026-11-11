import { describe, expect, it } from 'vitest'
import { parseNewProjectFields } from '@/lib/projects/parse-new-project-fields'
import { parseProjectInput } from '@/lib/projects/parse-project-input'

const form = (entries: Record<string, string | string[]>) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(entries)) {
    for (const item of [value].flat()) data.append(key, item)
  }
  return data
}

const base = { title: 'Website Relaunch', status: 'active', billing: 'hourly', hourlyRate: '95', contactIds: ['c1'] }

describe('parseProjectInput', () => {
  it('reads an hourly project and clears the other billing fields', () => {
    expect(parseProjectInput(form({ ...base, fixedPrice: '1000', description: '  Neue Seite  ', startDate: '2026-11-01' }))).toEqual({
      ok: true,
      value: {
        title: 'Website Relaunch',
        description: 'Neue Seite',
        status: 'active',
        startDate: '2026-11-01',
        endDate: null,
        billing: 'hourly',
        hourlyRateCents: 9500,
        fixedPriceCents: null,
        retainerAmountCents: null,
        retainerHours: null,
        contactIds: ['c1'],
      },
    })
  })

  it('reads a retainer with amount and hours per month', () => {
    const parsed = parseProjectInput(form({ ...base, billing: 'retainer', retainerAmount: '2.500,00', retainerHours: '20' }))
    expect(parsed.ok && parsed.value).toMatchObject({ billing: 'retainer', retainerAmountCents: 250000, retainerHours: 20, hourlyRateCents: null })
  })

  it('dedupes contacts', () => {
    const parsed = parseProjectInput(form({ ...base, contactIds: ['c1', 'c2', 'c1'] }))
    expect(parsed.ok && parsed.value.contactIds).toEqual(['c1', 'c2'])
  })

  it.each([
    [{ title: '' }, 'Titel ist erforderlich.'],
    [{ status: 'paused' }, 'Status ist ungültig.'],
    [{ contactIds: [] }, 'Mindestens ein Ansprechpartner ist erforderlich.'],
    [{ startDate: '2026-02-30' }, 'Datum ist ungültig.'],
    [{ startDate: '2026-11-10', endDate: '2026-11-01' }, 'Das Enddatum liegt vor dem Startdatum.'],
    [{ billing: 'free' }, 'Abrechnungsart ist erforderlich.'],
    [{ hourlyRate: '' }, 'Stundensatz ist erforderlich (z. B. 95 oder 95,50).'],
    [{ billing: 'fixed' }, 'Festpreis ist erforderlich (z. B. 12.000 oder 12000,00).'],
    [{ billing: 'retainer', retainerAmount: '1000', retainerHours: '2,5' }, 'Stundenkontingent pro Monat ist erforderlich (ganze Stunden).'],
  ])('rejects %j', (override, message) => {
    expect(parseProjectInput(form({ ...base, ...override }))).toEqual({ ok: false, message })
  })
})

describe('parseNewProjectFields', () => {
  it('uppercases the key', () => {
    expect(parseNewProjectFields(form({ key: ' br ', companyId: 'co1' }))).toEqual({ ok: true, value: { key: 'BR', companyId: 'co1' } })
  })

  it.each(['B', 'TOOLONG', '1B', 'B-R', ''])('rejects key %j', (key) => {
    expect(parseNewProjectFields(form({ key, companyId: 'co1' })).ok).toBe(false)
  })

  it('requires a company', () => {
    expect(parseNewProjectFields(form({ key: 'BR' }))).toEqual({ ok: false, message: 'Kunde ist erforderlich.' })
  })
})
