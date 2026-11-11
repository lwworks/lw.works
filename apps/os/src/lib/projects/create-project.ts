import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { companyExists } from '@/lib/db/companies/company-exists'
import { postgresErrorCode } from '@/lib/db/postgres-error-code'
import { activeKeyExists } from '@/lib/db/projects/active-key-exists'
import { insertProject } from '@/lib/db/projects/insert-project'
import { parseNewProjectFields } from '@/lib/projects/parse-new-project-fields'
import { parseProjectInput } from '@/lib/projects/parse-project-input'
import { slugify } from '@/lib/projects/slugify'
import { validateProjectContacts } from '@/lib/projects/validate-project-contacts'

/** Creates the project and assigns existing `KEY:` time entries of all users to it. */
export const createProject = async (formData: FormData) => {
  await requireUserId()
  const fixed = parseNewProjectFields(formData)
  if (!fixed.ok) return fixed
  const parsed = parseProjectInput(formData)
  if (!parsed.ok) return parsed

  if (!(await companyExists(fixed.value.companyId))) return { ok: false as const, message: 'Kunde wurde nicht gefunden.' }
  if (await activeKeyExists(fixed.value.key)) return { ok: false as const, message: `Das Kürzel ${fixed.value.key} ist bereits vergeben.` }
  if (!(await validateProjectContacts(fixed.value.companyId, parsed.value.contactIds))) {
    return { ok: false as const, message: 'Ansprechpartner müssen nicht-private Kontakte des Kunden sein.' }
  }

  const slug = slugify(parsed.value.title)
  try {
    await insertProject({ ...parsed.value, ...fixed.value, slug })
  } catch (error) {
    if (postgresErrorCode(error) === '23505') return { ok: false as const, message: 'Es gibt schon ein Projekt mit diesem Titel.' }
    throw error
  }
  return { ok: true as const, slug }
}
