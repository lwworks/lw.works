"use client"

import { setTimeEntriesBilledAction } from "@/app/projekte/actions"
import { Button } from "@lw/ui/components/button"
import { Input } from "@lw/ui/components/input"
import { Label } from "@lw/ui/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "@lw/ui/components/popover"
import { toast } from "@lw/ui/components/sonner"
import { cn } from "@lw/ui/lib/utils"
import { useState, useTransition, type FormEvent } from "react"

const countLabel = (count: number) => (count === 1 ? "1 Eintrag" : `${count} Einträge`)

/** Marks the selected open entries as billed, with an optional invoice number. */
export const MarkBilledButton = ({ projectId, ids, onDone }: { projectId: string; ids: string[]; onDone: () => void }) => {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const invoiceNumber = String(new FormData(event.currentTarget).get("invoiceNumber") ?? "")
    startTransition(async () => {
      const result = await setTimeEntriesBilledAction({ projectId, ids, billed: true, invoiceNumber })
      if (!result.ok) return void toast.error(result.message)
      toast.success(`${countLabel(result.count)} als abgerechnet markiert.`)
      setOpen(false)
      onDone()
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>Als abgerechnet markieren</Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className={cn("w-72")}>
        <form onSubmit={submit} className={cn("flex flex-col gap-3")}>
          <div className={cn("flex flex-col gap-1.5")}>
            <Label htmlFor="invoiceNumber">Rechnungsnummer</Label>
            <Input id="invoiceNumber" name="invoiceNumber" placeholder="Optional, z. B. RE-2026-042" maxLength={100} autoFocus autoComplete="off" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Speichert …" : `${countLabel(ids.length)} abrechnen`}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

/** Moves the selected billed entries back to open, e.g. after a cancelled invoice. */
export const MarkOpenButton = ({ projectId, ids, onDone }: { projectId: string; ids: string[]; onDone: () => void }) => {
  const [pending, startTransition] = useTransition()

  const reopen = () => {
    startTransition(async () => {
      const result = await setTimeEntriesBilledAction({ projectId, ids, billed: false })
      if (!result.ok) return void toast.error(result.message)
      toast.success(`${countLabel(result.count)} wieder offen.`)
      onDone()
    })
  }

  return (
    <Button variant="outline" onClick={reopen} disabled={pending}>
      {pending ? "Speichert …" : "Abrechnung zurücknehmen"}
    </Button>
  )
}
