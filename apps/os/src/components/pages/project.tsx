import { ProjectDetails } from "@/components/projects/project-details"
import type { ProjectContactOption } from "@/lib/db/contacts/list-project-contact-options"
import type { ProjectDetail } from "@/lib/db/projects/get-project-by-slug"
import type { ProjectTimeEntry } from "@/lib/db/time-entries/list-project-time-entries"
import { Layout } from "../molecules/layout"

export const ProjectPage = (props: {
  project: ProjectDetail
  entries: ProjectTimeEntry[]
  contactOptions: ProjectContactOption[]
  now: Date
}) => {
  return (
    <Layout>
      <ProjectDetails {...props} />
    </Layout>
  )
}
