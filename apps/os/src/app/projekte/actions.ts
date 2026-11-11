'use server'

import { archiveProject } from '@/lib/projects/archive-project'
import { createProject } from '@/lib/projects/create-project'
import { restoreProject } from '@/lib/projects/restore-project'
import { saveProject } from '@/lib/projects/save-project'
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
