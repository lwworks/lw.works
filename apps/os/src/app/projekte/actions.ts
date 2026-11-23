'use server'

import { addProjectNote } from '@/lib/notes/add-project-note'
import { archiveProject } from '@/lib/projects/archive-project'
import { createProject } from '@/lib/projects/create-project'
import { restoreProject } from '@/lib/projects/restore-project'
import { saveProject } from '@/lib/projects/save-project'
import { saveProjectDescription } from '@/lib/projects/save-project-description'
import { billTimeEntries } from '@/lib/time-tracking/bill-time-entries'
import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'

type FormActionState = { ok: true } | { ok: false; message: string } | null

export async function createProjectAction(_prev: FormActionState, formData: FormData) {
  const result = await createProject(formData)
  if (!result.ok) return result
  refresh()
  redirect(`/projekte/${result.slug}`)
}

export async function saveProjectAction(id: string, currentSlug: string, _prev: FormActionState, formData: FormData) {
  const result = await saveProject(id, formData)
  if (!result.ok) return result
  refresh()
  if (result.slug !== currentSlug) redirect(`/projekte/${result.slug}`)
  return { ok: true as const }
}

export async function archiveProjectAction(id: string) {
  const result = await archiveProject(id)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}

export async function restoreProjectAction(id: string) {
  const result = await restoreProject(id)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}

/** Marks the project's selected entries as billed on an invoice, or back to open. */
export async function setTimeEntriesBilledAction(input: { projectId: string; ids: string[]; billed: boolean; invoiceNumber?: string }) {
  const result = await billTimeEntries(input)
  if (result.ok) refresh()
  return result
}

/** `doc` is the editor's JSON; `addProjectNote` validates it. */
export async function addProjectNoteAction(projectId: string, doc: unknown) {
  const result = await addProjectNote(projectId, doc)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}

/**
 * Autosave of the description on the Kontext tab. No `refresh()`: the editor on the page already shows what was saved,
 * and a refresh on every pause in typing would re-render the whole project page.
 */
export async function saveProjectDescriptionAction(id: string, doc: unknown) {
  return saveProjectDescription(id, doc)
}
