"use client"

import { createCompanyAction, saveCompanyAction } from "@/app/unternehmen/actions"
import { Button } from "@lw/ui/components/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@lw/ui/components/dialog"
import { Input } from "@lw/ui/components/input"
import { Label } from "@lw/ui/components/label"
import { Pencil, Plus } from "@mynaui/icons-react"
import { useActionState, useEffect, useState } from "react"

type CompanyFormValues = {
  name: string
  logoUrl: string | null
  website: string | null
  street: string | null
  postalCode: string | null
  city: string | null
  country: string | null
}

const CompanyFields = ({
  company,
  action,
  onSaved,
}: {
  company?: CompanyFormValues
  action: (prev: { ok: true } | { ok: false; message: string } | null, formData: FormData) => Promise<{ ok: true } | { ok: false; message: string } | null>
  onSaved?: () => void
}) => {
  const [state, formAction, pending] = useActionState(action, null)
  useEffect(() => {
    if (state && state.ok) onSaved?.()
  }, [state, onSaved])
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Field label="Name" name="name" defaultValue={company?.name} required />
      <Field label="Logo-URL" name="logoUrl" defaultValue={company?.logoUrl} />
      <Field label="Website" name="website" defaultValue={company?.website} />
      <Field label="Straße" name="street" defaultValue={company?.street} />
      <Field label="Postleitzahl" name="postalCode" defaultValue={company?.postalCode} />
      <Field label="Ort" name="city" defaultValue={company?.city} />
      <Field label="Land" name="country" defaultValue={company?.country} />
      {state && !state.ok ? <p className="text-sm text-destructive">{state.message}</p> : null}
      <DialogFooter>
        <Button type="submit" disabled={pending}>{pending ? "Speichert …" : "Speichern"}</Button>
      </DialogFooter>
    </form>
  )
}

const Field = ({ label, name, defaultValue, required = false }: { label: string; name: string; defaultValue?: string | null; required?: boolean }) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={name}>{label}</Label>
    <Input id={name} name={name} defaultValue={defaultValue ?? ""} required={required} />
  </div>
)

export const CreateCompanyDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>
        <Plus strokeWidth={1.5} className="size-4" />
        <span>Neues Unternehmen</span>
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Neues Unternehmen</DialogTitle>
      </DialogHeader>
      <CompanyFields action={createCompanyAction} />
    </DialogContent>
  </Dialog>
)

export const EditCompanyDialog = ({ company }: { company: CompanyFormValues & { id: string } }) => {
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  return (
    <Dialog open={open} onOpenChange={(next) => {
      setOpen(next)
      if (next) setFormKey((key) => key + 1)
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil strokeWidth={1.5} className="size-4" />
          <span>Bearbeiten</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unternehmen bearbeiten</DialogTitle>
        </DialogHeader>
        <CompanyFields key={formKey} company={company} action={saveCompanyAction.bind(null, company.id)} onSaved={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
