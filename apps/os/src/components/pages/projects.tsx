import { ProjectsTable } from "@/components/projects/table"
import type { ProjectListItem } from "@/lib/db/projects/list-projects"
import { Layout } from "../molecules/layout"

export const ProjectsPage = ({ projects, archived }: { projects: ProjectListItem[]; archived: boolean }) => {
  return (
    <Layout>
      <ProjectsTable projects={projects} archived={archived} />
    </Layout>
  )
}
