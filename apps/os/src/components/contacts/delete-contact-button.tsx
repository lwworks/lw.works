"use client"

import { deleteContactAction } from "@/app/kontakte/actions"
import { Button } from "@lw/ui/components/button"
import { toast } from "@lw/ui/components/sonner"
import { Trash } from "@mynaui/icons-react"
import { useTransition } from "react"

export const DeleteContactButton = ({ displayId }: { displayId: number }) => {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Kontakt löschen? Er verschwindet aus dem OS und aus Google Kontakte.")) return
        startTransition(async () => {
          const result = await deleteContactAction(displayId)
          if (result && !result.ok) toast.error(result.message)
        })
      }}
    >
      <Trash strokeWidth={1.5} className="size-4" />
      <span>{pending ? "Löscht …" : "Löschen"}</span>
    </Button>
  )
}
