"use client"

import { setContactPrivacyAction } from "@/app/kontakte/actions"
import { Label } from "@lw/ui/components/label"
import { Switch } from "@lw/ui/components/switch"
import { toast } from "@lw/ui/components/sonner"
import { Lock } from "@mynaui/icons-react"
import { useTransition } from "react"

export const PrivacySwitch = ({ displayId, isPrivate }: { displayId: number; isPrivate: boolean }) => {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex min-h-6 items-center justify-between gap-3">
      <Label htmlFor="privacy-switch" className="gap-2 font-normal">
        <Lock strokeWidth={1.5} className="size-4" />
        <span>Privat</span>
      </Label>
      <Switch
        id="privacy-switch"
        checked={isPrivate}
        disabled={pending}
        onCheckedChange={(checked) => {
          startTransition(async () => {
            const result = await setContactPrivacyAction(displayId, checked)
            if (!result.ok) toast.error(result.message)
          })
        }}
      />
    </div>
  )
}
