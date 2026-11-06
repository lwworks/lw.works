"use client"

import { removeCompanyAction } from "@/app/unternehmen/actions"
import { Button } from "@lw/ui/components/button"
import { toast } from "@lw/ui/components/sonner"
import { Trash } from "@mynaui/icons-react"
import { useTransition } from "react"

export const DeleteCompanyButton = ({ id }: { id: string }) => {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Unternehmen löschen? Kontakte verlieren die Zuordnung.")) return
        startTransition(async () => {
          const result = await removeCompanyAction(id)
          if (result && !result.ok) toast.error(result.message)
        })
      }}
    >
      <Trash strokeWidth={1.5} className="size-4" />
      <span>{pending ? "Löscht …" : "Löschen"}</span>
    </Button>
  )
}
