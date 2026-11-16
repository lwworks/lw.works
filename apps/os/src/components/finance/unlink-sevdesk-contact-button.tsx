"use client"

import { linkCompanySevdeskContactAction } from "@/app/unternehmen/actions"
import { Button } from "@lw/ui/components/button"
import { toast } from "@lw/ui/components/sonner"
import { useTransition } from "react"

export const UnlinkSevdeskContactButton = ({ companyId }: { companyId: string }) => {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await linkCompanySevdeskContactAction(companyId, null)
          if (!result.ok) toast.error(result.message)
        })
      }
    >
      Verknüpfung lösen
    </Button>
  )
}
