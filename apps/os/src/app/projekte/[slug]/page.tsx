import { ProjectPage } from '@/components/pages/project'
import { getSession } from '@/lib/auth/get-session'
import { listProjectContactOptions } from '@/lib/db/contacts/list-project-contact-options'
import { listAssignableProjects } from '@/lib/db/projects/list-assignable-projects'
import { getProjectBySlug } from '@/lib/db/projects/get-project-by-slug'
import { listProjectTimeEntries } from '@/lib/db/time-entries/list-project-time-entries'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Projekt' }

export default async function Page({ params, searchParams }: PageProps<'/projekte/[slug]'>) {
  const { slug } = await params
  const view = (await searchParams).abgerechnet === '1' ? 'billed' : 'open'
  const session = await getSession()
  if (!session) redirect('/login')
  const project = await getProjectBySlug(slug)
  if (!project) notFound()
  const [entries, contactOptions, projects] = await Promise.all([
    listProjectTimeEntries(project.id, view),
    listProjectContactOptions({ companyId: project.companyId }),
    listAssignableProjects(),
  ])
  return <ProjectPage project={project} entries={entries} view={view} contactOptions={contactOptions} projects={projects} now={new Date()} />
}
