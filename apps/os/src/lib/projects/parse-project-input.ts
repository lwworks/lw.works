import { readOptionalText } from '@/lib/contacts/read-optional-text'
import type { ProjectBilling, ProjectStatus } from '@/lib/db/schema/projects'
import { parseEuroCents } from '@/lib/projects/parse-euro-cents'

export type ProjectInput = {
  title: string
  description: string | null
  status: ProjectStatus
  startDate: string | null
  endDate: string | null
  billing: ProjectBilling
  hourlyRateCents: number | null
  fixedPriceCents: number | null
  retainerAmountCents: number | null
  retainerHours: number | null
  contactIds: string[]
}

type Result = { ok: true; value: ProjectInput } | { ok: false; message: string }

const STATUSES: readonly ProjectStatus[] = ['planning', 'active', 'completed']
const BILLINGS: readonly ProjectBilling[] = ['hourly', 'fixed', 'retainer']

/** `YYYY-MM-DD` that is a real calendar day, `null` when empty, `undefined` when invalid. */
const readDate = (value: FormDataEntryValue | null) => {
  const text = readOptionalText(value, 10)
  if (!text) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return undefined
  const date = new Date(`${text}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(text) ? text : undefined
}

const readCents = (formData: FormData, name: string) => {
  const text = readOptionalText(formData.get(name), 30)
  return text ? parseEuroCents(text) : null
}

/** The editable project fields. Key and company are set only on create (see `parseNewProjectFields`). */
export const parseProjectInput = (formData: FormData): Result => {
  const title = readOptionalText(formData.get('title'), 200)
  if (!title) return { ok: false, message: 'Titel ist erforderlich.' }

  const status = formData.get('status')
  if (!STATUSES.includes(status as ProjectStatus)) return { ok: false, message: 'Status ist ungültig.' }

  const startDate = readDate(formData.get('startDate'))
  const endDate = readDate(formData.get('endDate'))
  if (startDate === undefined || endDate === undefined) return { ok: false, message: 'Datum ist ungültig.' }
  if (startDate && endDate && endDate < startDate) return { ok: false, message: 'Das Enddatum liegt vor dem Startdatum.' }

  const billing = formData.get('billing')
  if (!BILLINGS.includes(billing as ProjectBilling)) return { ok: false, message: 'Abrechnungsart ist erforderlich.' }

  const amounts = { hourlyRateCents: null, fixedPriceCents: null, retainerAmountCents: null, retainerHours: null } as Pick<
    ProjectInput,
    'hourlyRateCents' | 'fixedPriceCents' | 'retainerAmountCents' | 'retainerHours'
  >
  if (billing === 'hourly') {
    amounts.hourlyRateCents = readCents(formData, 'hourlyRate')
    if (amounts.hourlyRateCents === null) return { ok: false, message: 'Stundensatz ist erforderlich (z. B. 95 oder 95,50).' }
  } else if (billing === 'fixed') {
    amounts.fixedPriceCents = readCents(formData, 'fixedPrice')
    if (amounts.fixedPriceCents === null) return { ok: false, message: 'Festpreis ist erforderlich (z. B. 12.000 oder 12000,00).' }
  } else {
    amounts.retainerAmountCents = readCents(formData, 'retainerAmount')
    if (amounts.retainerAmountCents === null) return { ok: false, message: 'Retainer-Betrag pro Monat ist erforderlich.' }
    const hours = readOptionalText(formData.get('retainerHours'), 6)
    if (!hours || !/^\d+$/.test(hours) || Number(hours) < 1) {
      return { ok: false, message: 'Stundenkontingent pro Monat ist erforderlich (ganze Stunden).' }
    }
    amounts.retainerHours = Number(hours)
  }

  const contactIds = [
    ...new Set(formData.getAll('contactIds').flatMap((value) => (typeof value === 'string' && value.trim() ? [value.trim().slice(0, 80)] : []))),
  ]
  if (contactIds.length === 0) return { ok: false, message: 'Mindestens ein Ansprechpartner ist erforderlich.' }

  return {
    ok: true,
    value: {
      title,
      description: readOptionalText(formData.get('description'), 5000),
      status: status as ProjectStatus,
      startDate,
      endDate,
      billing: billing as ProjectBilling,
      ...amounts,
      contactIds,
    },
  }
}
