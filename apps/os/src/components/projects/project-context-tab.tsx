import { NotesSection } from "@/components/notes/notes-section"
import { ProjectDescription } from "@/components/projects/project-description"
import type { TimelineItem } from "@/lib/contacts/build-contact-timeline"
import type { ProjectDetail } from "@/lib/db/projects/get-project-by-slug"
import { cn } from "@lw/ui/lib/utils"

/** Kontext tab of a project: the description, edited in place, then notes and activity. */
export const ProjectContextTab = ({ project, timeline }: { project: ProjectDetail; timeline: TimelineItem[] }) => (
  <>
    <div className={cn("border-b border-neutral-200 px-4 py-8 sm:px-8 lg:px-16 dark:border-neutral-800")}>
      <ProjectDescription projectId={project.id} initial={project.description} readOnly={project.archivedAt !== null} />
    </div>
    <NotesSection target={{ type: "project", id: project.id }} subject="Projekt" timeline={timeline} />
  </>
)
