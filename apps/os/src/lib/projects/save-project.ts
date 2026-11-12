import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { postgresErrorCode } from '@/lib/db/postgres-error-code'
import { getProjectMeta } from '@/lib/db/projects/get-project-meta'
import { updateProject } from '@/lib/db/projects/update-project'
import { parseProjectInput } from '@/lib/projects/parse-project-input'
import { slugify } from '@/lib/projects/slugify'
import { validateProjectContacts } from '@/lib/projects/validate-project-contacts'

/** Saves the editable fields; the slug follows a changed title. Archived projects are read-only. */
export const saveProject = async (id: string, formData: FormData) => {
  await requireUserId()
  const existing = await getProjectMeta(id)
  if (!existing) return { ok: false as const, message: 'Projekt wurde nicht gefunden.' }
  if (existing.archivedAt) return { ok: false as const, message: 'Archivierte Projekte können nicht bearbeitet werden.' }
  const parsed = parseProjectInput(formData)
  if (!parsed.ok) return parsed
  if (!(await validateProjectContacts(existing.companyId, parsed.value.contactIds))) {
    return { ok: false as const, message: 'Ansprechpartner müssen nicht-private Kontakte des Kunden sein.' }
  }

  const slug = slugify(parsed.value.title)
  try {
    await updateProject(id, { ...parsed.value, slug })
  } catch (error) {
    if (postgresErrorCode(error) === '23505') return { ok: false as const, message: 'Es gibt schon ein Projekt mit diesem Titel.' }
    throw error
  }
  return { ok: true as const, slug }
}
