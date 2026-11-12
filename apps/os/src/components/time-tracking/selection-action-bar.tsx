"use client"

import { assignTimeEntriesAction } from "@/app/zeiterfassung/actions"
import { CompanyIcon } from "@/components/atoms/company-icon"
import type { AssignableProject } from "@/lib/db/projects/list-assignable-projects"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lw/ui/components/select"
import { toast } from "@lw/ui/components/sonner"
import { cn } from "@lw/ui/lib/utils"
import { useTransition } from "react"

const NONE = "none"

/** Floating bar for the selected entries: assign them to a project or to none. */
export const SelectionActionBar = ({
  selectedIds,
  projects,
  onDone,
}: {
  selectedIds: string[]
  projects: AssignableProject[]
  onDone: () => void
}) => {
  const [pending, startTransition] = useTransition()

  const assign = (value: string) => {
    startTransition(async () => {
      const result = await assignTimeEntriesAction(selectedIds, value === NONE ? null : value)
      if (!result.ok) return void toast.error(result.message)
      onDone()
    })
  }

  return (
    <div
      role="toolbar"
      aria-label="Ausgewählte Einträge"
      className={cn(
        "fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-neutral-200 bg-white p-2 pl-4 text-sm shadow-lg dark:border-neutral-800 dark:bg-neutral-950",
      )}
    >
      <span className={cn("font-medium text-black tabular-nums dark:text-white")}>
        {selectedIds.length === 1 ? "1 Eintrag" : `${selectedIds.length} Einträge`}
      </span>
      <Select value="" onValueChange={assign} disabled={pending}>
        <SelectTrigger className={cn("w-56")}>
          <SelectValue placeholder={pending ? "Speichert …" : "Projekt zuordnen …"} />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <CompanyIcon companyId={project.companyId} logoKey={project.companyLogoKey} />
              <span className={cn("font-mono text-xs")}>{project.key}</span>
              <span>{project.title}</span>
            </SelectItem>
          ))}
          <SelectItem value={NONE}>Ohne Projekt</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
