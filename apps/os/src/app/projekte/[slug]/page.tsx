import { ProjectPage } from '@/components/pages/project'
import { getSession } from '@/lib/auth/get-session'
import { listProjectContactOptions } from '@/lib/db/contacts/list-project-contact-options'
import { listNotes } from '@/lib/db/notes/list-notes'
import { listAssignableProjects } from '@/lib/db/projects/list-assignable-projects'
import { getProjectBySlug } from '@/lib/db/projects/get-project-by-slug'
import { listProjectTimeEntries } from '@/lib/db/time-entries/list-project-time-entries'
import { buildNotesTimeline } from '@/lib/notes/build-notes-timeline'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Projekt' }

export default async function Page({ params, searchParams }: PageProps<'/projekte/[slug]'>) {
  const { slug } = await params
  const tab = (await searchParams).ansicht
  const view = tab === 'offen' ? 'open' : tab === 'abgerechnet' ? 'billed' : 'all'
  const session = await getSession()
  if (!session) redirect('/login')
  const project = await getProjectBySlug(slug)
  if (!project) notFound()
  const [entries, contactOptions, projects, notes] = await Promise.all([
    listProjectTimeEntries(project.id, view),
    listProjectContactOptions({ companyId: project.companyId }),
    listAssignableProjects(),
    listNotes({ projectId: project.id }),
  ])
  return (
    <ProjectPage
      project={project}
      entries={entries}
      view={view}
      contactOptions={contactOptions}
      projects={projects}
      timeline={buildNotesTimeline(project.createdAt, notes)}
      now={new Date()}
    />
  )
}
