import { ProjectPage } from '@/components/pages/project'
import { getSession } from '@/lib/auth/get-session'
import { listProjectContactOptions } from '@/lib/db/contacts/list-project-contact-options'
import { listNotes } from '@/lib/db/notes/list-notes'
import { getProjectBySlug } from '@/lib/db/projects/get-project-by-slug'
import { buildNotesTimeline } from '@/lib/notes/build-notes-timeline'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Projekt' }

/** Kontext tab: description and notes. */
export default async function Page({ params, searchParams }: PageProps<'/projekte/[slug]'>) {
  const { slug } = await params
  // Time entry filters used to live on this URL; keep old links working.
  const { ansicht } = await searchParams
  if (typeof ansicht === 'string') redirect(`/projekte/${slug}/zeiterfassung?ansicht=${encodeURIComponent(ansicht)}`)

  const session = await getSession()
  if (!session) redirect('/login')
  const project = await getProjectBySlug(slug)
  if (!project) notFound()
  const [contactOptions, notes] = await Promise.all([
    listProjectContactOptions({ companyId: project.companyId }),
    listNotes({ projectId: project.id }),
  ])
  return <ProjectPage tab="context" project={project} contactOptions={contactOptions} timeline={buildNotesTimeline(project.createdAt, notes)} />
}
