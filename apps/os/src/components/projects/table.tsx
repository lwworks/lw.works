"use client"

import { CompanyPill } from "@/components/atoms/company-pill"
import { EmptyTableRow, SelectableTableHeader, SelectableTableRow, SelectionBar } from "@/components/molecules/selectable-table"
import { firstTextCell, lastTextCell, trailGutterCell } from "@/components/molecules/table-gutters"
import { ProjectBadge } from "@/components/projects/project-badge"
import type { ProjectListItem } from "@/lib/db/projects/list-projects"
import { formatDuration } from "@/lib/format/format-duration"
import { projectStatusLabel } from "@/lib/projects/project-status-label"
import { useRowSelection } from "@/lib/selection/use-row-selection"
import { Button } from "@lw/ui/components/button"
import { Table, TableBody, TableCell, TableHead } from "@lw/ui/components/table"
import { cn } from "@lw/ui/lib/utils"
import { Plus } from "@mynaui/icons-react"
import Link from "next/link"
import { PageHeader } from "../molecules/page-header"

export const ProjectsTable = ({ projects, archived }: { projects: ProjectListItem[]; archived: boolean }) => {
  const selection = useRowSelection(projects.map((project) => project.id))
  const selectedCount = selection.selectedIds.length
  const selectedMs = projects.filter((project) => selection.isSelected(project.id)).reduce((sum, project) => sum + project.trackedMs, 0)
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
      <Table className={cn("min-w-2xl")}>
        <SelectableTableHeader selection={selection} label="Alle Projekte auswählen">
          <TableHead className={cn(firstTextCell)}>Projekt</TableHead>
          <TableHead>Kunde</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className={cn("text-right", lastTextCell)}>Stunden</TableHead>
          <TableHead className={cn(trailGutterCell)} />
        </SelectableTableHeader>
        <TableBody>
          {projects.length === 0 ? <EmptyTableRow columns={6}>{archived ? "Keine archivierten Projekte." : "Noch keine Projekte."}</EmptyTableRow> : null}
          {projects.map((project) => (
            <SelectableTableRow key={project.id} selection={selection} id={project.id} label={`${project.title} auswählen`}>
              <TableCell className={cn(firstTextCell)}>
                <Link href={`/projekte/${project.slug}`} className={cn("group inline-flex items-center gap-2 font-medium text-black dark:text-white")}>
                  <ProjectBadge projectKey={project.key} companyId={project.companyId} logoKey={project.companyLogoKey} />
                  <span className={cn("group-hover:underline")}>{project.title}</span>
                </Link>
              </TableCell>
              <TableCell>
                <CompanyPill company={{ id: project.companyId, name: project.companyName, logoKey: project.companyLogoKey }} />
              </TableCell>
              <TableCell>{projectStatusLabel(project.status)}</TableCell>
              <TableCell className={cn("text-right tabular-nums", lastTextCell)}>{formatDuration(project.trackedMs)}</TableCell>
              <TableCell className={cn(trailGutterCell)} />
            </SelectableTableRow>
          ))}
        </TableBody>
      </Table>
      <SelectionBar
        selection={selection}
        label="Ausgewählte Projekte"
        count={selectedCount === 1 ? "1 Projekt" : `${selectedCount} Projekte`}
        detail={formatDuration(selectedMs)}
      />
    </section>
  )
}
