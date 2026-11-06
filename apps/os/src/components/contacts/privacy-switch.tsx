"use client"

import { setContactPrivacyAction } from "@/app/kontakte/actions"
import { Label } from "@lw/ui/components/label"
import { Switch } from "@lw/ui/components/switch"
import { toast } from "@lw/ui/components/sonner"
import { useTransition } from "react"

export const PrivacySwitch = ({ displayId, isPrivate }: { displayId: number; isPrivate: boolean }) => {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor="privacy-switch">Privat</Label>
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
