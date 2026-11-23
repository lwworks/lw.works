import { ProjectPage } from '@/components/pages/project'
import { getSession } from '@/lib/auth/get-session'
import { listProjectContactOptions } from '@/lib/db/contacts/list-project-contact-options'
import { listAssignableProjects } from '@/lib/db/projects/list-assignable-projects'
import { getProjectBySlug } from '@/lib/db/projects/get-project-by-slug'
import { listProjectTimeEntries } from '@/lib/db/time-entries/list-project-time-entries'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Zeiterfassung · Projekt' }

/** Zeiterfassung tab: the project's time entries, filtered by `?ansicht=offen|abgerechnet`. */
export default async function Page({ params, searchParams }: PageProps<'/projekte/[slug]/zeiterfassung'>) {
  const { slug } = await params
  const tab = (await searchParams).ansicht
  const view = tab === 'offen' ? 'open' : tab === 'abgerechnet' ? 'billed' : 'all'
  const session = await getSession()
  if (!session) redirect('/login')
  const project = await getProjectBySlug(slug)
  if (!project) notFound()
  const [entries, contactOptions, projects] = await Promise.all([
    listProjectTimeEntries(project.id, view),
    listProjectContactOptions({ companyId: project.companyId }),
    listAssignableProjects(),
  ])
  return <ProjectPage tab="time" project={project} entries={entries} view={view} contactOptions={contactOptions} projects={projects} now={new Date()} />
}
