import { NotesSection } from "@/components/notes/notes-section"
import { ProjectDetails } from "@/components/projects/project-details"
import type { TimelineItem } from "@/lib/contacts/build-contact-timeline"
import type { ProjectContactOption } from "@/lib/db/contacts/list-project-contact-options"
import type { AssignableProject } from "@/lib/db/projects/list-assignable-projects"
import type { ProjectDetail } from "@/lib/db/projects/get-project-by-slug"
import type { ProjectTimeEntriesView, ProjectTimeEntry } from "@/lib/db/time-entries/list-project-time-entries"
import { cn } from "@lw/ui/lib/utils"
import { Layout } from "../molecules/layout"

export const ProjectPage = ({
  timeline,
  ...props
}: {
  project: ProjectDetail
  entries: ProjectTimeEntry[]
  view: ProjectTimeEntriesView
  contactOptions: ProjectContactOption[]
  projects: AssignableProject[]
  timeline: TimelineItem[]
  now: Date
}) => {
  return (
    <Layout>
      <ProjectDetails {...props} />
      <section className={cn("border-t border-neutral-200 dark:border-neutral-800")}>
        <NotesSection target={{ type: "project", id: props.project.id }} subject="Projekt" timeline={timeline} />
      </section>
    </Layout>
  )
}
