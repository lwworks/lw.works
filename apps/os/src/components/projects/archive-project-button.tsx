"use client"

import { archiveProjectAction, restoreProjectAction } from "@/app/projekte/actions"
import { Button } from "@lw/ui/components/button"
import { toast } from "@lw/ui/components/sonner"
import { Archive, Undo } from "@mynaui/icons-react"
import { useTransition } from "react"

export const ArchiveProjectButton = ({ id, projectKey, archived }: { id: string; projectKey: string; archived: boolean }) => {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!archived && !confirm(`Projekt archivieren? Das Kürzel ${projectKey} wird wieder frei; bisher zugeordnete Zeiteinträge bleiben beim Projekt.`)) return
        startTransition(async () => {
          const result = archived ? await restoreProjectAction(id) : await archiveProjectAction(id)
          if (!result.ok) toast.error(result.message)
        })
      }}
    >
      {archived ? <Undo strokeWidth={1.5} className="size-4" /> : <Archive strokeWidth={1.5} className="size-4" />}
      <span>{archived ? (pending ? "Stellt wieder her …" : "Wiederherstellen") : pending ? "Archiviert …" : "Archivieren"}</span>
    </Button>
  )
}
