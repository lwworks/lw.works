import { ProjectContextTab } from "@/components/projects/project-context-tab"
import { ProjectDetails } from "@/components/projects/project-details"
import { ProjectTimeTab } from "@/components/projects/project-time-tab"
import type { TimelineItem } from "@/lib/contacts/build-contact-timeline"
import type { ProjectContactOption } from "@/lib/db/contacts/list-project-contact-options"
import type { AssignableProject } from "@/lib/db/projects/list-assignable-projects"
import type { ProjectDetail } from "@/lib/db/projects/get-project-by-slug"
import type { ProjectTimeEntriesView, ProjectTimeEntry } from "@/lib/db/time-entries/list-project-time-entries"
import { Layout } from "../molecules/layout"

type ProjectPageProps = { project: ProjectDetail; contactOptions: ProjectContactOption[] } & (
  | { tab: "context"; timeline: TimelineItem[] }
  | { tab: "time"; entries: ProjectTimeEntry[]; view: ProjectTimeEntriesView; projects: AssignableProject[]; now: Date }
)

export const ProjectPage = (props: ProjectPageProps) => (
  <Layout>
    <ProjectDetails project={props.project} contactOptions={props.contactOptions} tab={props.tab}>
      {props.tab === "context" ? (
        <ProjectContextTab project={props.project} timeline={props.timeline} />
      ) : (
        <ProjectTimeTab project={props.project} entries={props.entries} view={props.view} projects={props.projects} now={props.now} />
      )}
    </ProjectDetails>
  </Layout>
)
