import { TabLink, TabNav } from "@/components/molecules/tabs"
import { ProjectTimeEntriesTable } from "@/components/projects/project-time-entries-table"
import type { AssignableProject } from "@/lib/db/projects/list-assignable-projects"
import type { ProjectDetail } from "@/lib/db/projects/get-project-by-slug"
import { PROJECT_TIME_ENTRIES_LIMIT, type ProjectTimeEntriesView, type ProjectTimeEntry } from "@/lib/db/time-entries/list-project-time-entries"
import { cn } from "@lw/ui/lib/utils"

const VIEW_TABS: { view: ProjectTimeEntriesView; label: string; query: string | null }[] = [
  { view: "all", label: "Alle", query: null },
  { view: "open", label: "Offen", query: "offen" },
  { view: "billed", label: "Abgerechnet", query: "abgerechnet" },
]

const VIEW_DESCRIPTIONS: Record<ProjectTimeEntriesView, string> = {
  all: "Alle Einträge aller Nutzer.",
  open: "Noch nicht abgerechnete Einträge aller Nutzer.",
  billed: "Abgerechnete Einträge aller Nutzer.",
}

/** Zeiterfassung tab of a project: its time entries, filtered by All/Open/Billed. */
export const ProjectTimeTab = ({
  project,
  entries,
  view,
  projects,
  now,
}: {
  project: ProjectDetail
  entries: ProjectTimeEntry[]
  view: ProjectTimeEntriesView
  projects: AssignableProject[]
  now: Date
}) => {
  const base = `/projekte/${project.slug}/zeiterfassung`
  return (
    <>
      <div className={cn("px-4 sm:px-8 lg:px-16 pt-8")}>
        <p className={cn("text-sm")}>
          {VIEW_DESCRIPTIONS[view]}
          {entries.length === PROJECT_TIME_ENTRIES_LIMIT ? ` Die neuesten ${PROJECT_TIME_ENTRIES_LIMIT}.` : null} Termine mit{" "}
          <span className={cn("font-mono text-black dark:text-white")}>{project.key}:</span> am Anfang des Titels werden automatisch zugeordnet.
        </p>
        <TabNav aria-label="Zeiteinträge filtern" className={cn("mt-4")}>
          {VIEW_TABS.map((tab) => (
            <TabLink key={tab.view} href={tab.query ? `${base}?ansicht=${tab.query}` : base} active={view === tab.view}>
              {tab.label}
            </TabLink>
          ))}
        </TabNav>
      </div>
      <ProjectTimeEntriesTable key={view} entries={entries} view={view} projectId={project.id} projectKey={project.key} projects={projects} now={now} />
    </>
  )
}
