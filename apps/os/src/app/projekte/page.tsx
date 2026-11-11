import { ProjectsPage } from '@/components/pages/projects'
import { getSession } from '@/lib/auth/get-session'
import { listProjects } from '@/lib/db/projects/list-projects'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Projekte' }

export default async function Page({ searchParams }: PageProps<'/projekte'>) {
  const session = await getSession()
  if (!session) redirect('/login')
  const archived = (await searchParams).archiviert === '1'
  return <ProjectsPage projects={await listProjects({ archived })} archived={archived} />
}
