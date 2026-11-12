import { ProjectBadge } from "@/components/projects/project-badge"
import type { ProjectListItem } from "@/lib/db/projects/list-projects"
import { formatDuration } from "@/lib/format/format-duration"
import { formatBilling } from "@/lib/projects/format-billing"
import { formatProjectPeriod } from "@/lib/projects/format-project-period"
import { projectStatusLabel } from "@/lib/projects/project-status-label"
import { Button } from "@lw/ui/components/button"
import { cn } from "@lw/ui/lib/utils"
import { Plus } from "@mynaui/icons-react"
import Link from "next/link"
import { PageHeader } from "../molecules/page-header"

export const ProjectsTable = ({ projects, archived }: { projects: ProjectListItem[]; archived: boolean }) => {
  return (
    <section>
      <PageHeader
        title={archived ? "Archivierte Projekte" : "Projekte"}
        description={
          <>
            Kalendertermine mit <span className={cn("font-mono text-black dark:text-white")}>KÜRZEL:</span> am Anfang des Titels werden dem Projekt automatisch zugeordnet.
          </>
        }
      >
        <Button variant="ghost" asChild>
          <Link href={archived ? "/projekte" : "/projekte?archiviert=1"}>{archived ? "Aktive Projekte" : "Archiv"}</Link>
        </Button>
        <Button asChild>
          <Link href="/projekte/neu">
            <Plus strokeWidth={1.5} className={cn("size-4")} />
            <span>Neues Projekt</span>
          </Link>
        </Button>
      </PageHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-3xl">
          <thead>
            <tr className={cn("h-10 border-y border-neutral-200 dark:border-neutral-800")}>
              <td className={cn("pr-2 pl-4 sm:pl-8 lg:pl-16")}>Projekt</td>
              <td className={cn("pr-2")}>Kunde</td>
              <td className={cn("pr-2")}>Status</td>
              <td className={cn("pr-2")}>Abrechnung</td>
              <td className={cn("pr-2")}>Zeitraum</td>
              <td className={cn("pr-4 sm:pr-8 lg:pr-16 text-right")}>Stunden</td>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr className={cn("h-16 border-b border-neutral-200 dark:border-neutral-800")}>
                <td colSpan={6} className={cn("px-4 sm:px-8 lg:px-16")}>{archived ? "Keine archivierten Projekte." : "Noch keine Projekte."}</td>
              </tr>
            ) : null}
            {projects.map((project) => (
              <tr key={project.id} className={cn("h-10 border-b border-neutral-200 dark:border-neutral-800")}>
                <td className={cn("pr-2 pl-4 sm:pl-8 lg:pl-16")}>
                  <Link href={`/projekte/${project.slug}`} className={cn("inline-flex items-center gap-2 font-medium text-black hover:underline dark:text-white")}>
                    <ProjectBadge projectKey={project.key} />
                    <span>{project.title}</span>
                  </Link>
                </td>
                <td className={cn("pr-2")}>{project.companyName}</td>
                <td className={cn("pr-2")}>{projectStatusLabel(project.status)}</td>
                <td className={cn("pr-2")}>{formatBilling({ billing: project.billing })}</td>
                <td className={cn("pr-2 tabular-nums")}>{formatProjectPeriod(project)}</td>
                <td className={cn("pr-4 sm:pr-8 lg:pr-16 text-right tabular-nums")}>{formatDuration(project.trackedMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
