"use client"

import { syncSevdeskAction } from "@/app/finanzen/actions"
import { Button } from "@lw/ui/components/button"
import { toast } from "@lw/ui/components/sonner"
import { cn } from "@lw/ui/lib/utils"
import { Refresh } from "@mynaui/icons-react"
import { useTransition } from "react"

export const SevdeskSyncButton = () => {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await syncSevdeskAction()
          if (result.status === "ok") toast.success(`${result.invoices} Belege aus SevDesk aktualisiert.`)
          else if (result.status === "locked") toast.info("Der Sync läuft gerade schon.")
          else toast.error(result.error)
        })
      }
    >
      <Refresh strokeWidth={1.5} className={cn("size-4", pending && "animate-spin")} />
      <span>{pending ? "Synchronisiere…" : "Jetzt synchronisieren"}</span>
    </Button>
  )
}
