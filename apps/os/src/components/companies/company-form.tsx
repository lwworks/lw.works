"use client"

import { createCompanyAction, saveCompanyAction } from "@/app/unternehmen/actions"
import { CompanyLogoField } from "@/components/companies/company-logo-field"
import { Button } from "@lw/ui/components/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@lw/ui/components/dialog"
import { Input } from "@lw/ui/components/input"
import { Label } from "@lw/ui/components/label"
import { cn } from "@lw/ui/lib/utils"
import { Pencil, Plus, Trash } from "@mynaui/icons-react"
import { useActionState, useEffect, useState } from "react"

type LocationValues = {
  id: string | null
  label: string | null
  street: string | null
  postalCode: string | null
  city: string | null
  country: string | null
}

type CompanyFormValues = {
  name: string
  website: string | null
  locations: LocationValues[]
}

const emptyLocation = (): LocationValues => ({ id: null, label: null, street: null, postalCode: null, city: null, country: null })

let nextRowKey = 0
const withKey = (location: LocationValues) => ({ key: nextRowKey++, location })

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
  const [rows, setRows] = useState(() => {
    const locations = company?.locations ?? []
    return (locations.length > 0 ? locations : [emptyLocation()]).map(withKey)
  })
  useEffect(() => {
    if (state && state.ok) onSaved?.()
  }, [state, onSaved])
  return (
    <form
      action={formAction}
      className="flex flex-col gap-3"
      onReset={(event) => {
        // React resets the form after every action; keep what was typed when saving fails.
        event.preventDefault()
      }}
    >
      <Field label="Name" name="name" defaultValue={company?.name} required />
      <Field label="Website" name="website" defaultValue={company?.website} placeholder="example.com" />
      {rows.map(({ key, location }, index) => (
        <fieldset key={key} className={cn("flex flex-col gap-3 border-t border-border pt-3")}>
          <div className={cn("flex items-center justify-between gap-2")}>
            <legend className={cn("text-sm font-medium text-black dark:text-white")}>{index === 0 ? "Hauptstandort" : `Standort ${index + 1}`}</legend>
            {rows.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Standort entfernen"
                onClick={() => setRows((current) => current.filter((row) => row.key !== key))}
              >
                <Trash strokeWidth={1.5} className={cn("size-4")} />
              </Button>
            ) : null}
          </div>
          <input type="hidden" name="locationId" value={location.id ?? ""} />
          <Field label="Bezeichnung" name="locationLabel" rowKey={key} defaultValue={location.label} placeholder="z. B. Hauptsitz, Büro Hamburg" />
          <Field label="Straße" name="street" rowKey={key} defaultValue={location.street} />
          <div className={cn("grid grid-cols-[1fr_2fr] gap-3")}>
            <Field label="Postleitzahl" name="postalCode" rowKey={key} defaultValue={location.postalCode} />
            <Field label="Ort" name="city" rowKey={key} defaultValue={location.city} />
          </div>
          <Field label="Land" name="country" rowKey={key} defaultValue={location.country} />
        </fieldset>
      ))}
      <Button type="button" variant="outline" onClick={() => setRows((current) => [...current, withKey(emptyLocation())])}>
        <Plus strokeWidth={1.5} className={cn("size-4")} />
        <span>Standort hinzufügen</span>
      </Button>
      {state && !state.ok ? <p className="text-sm text-destructive">{state.message}</p> : null}
      <DialogFooter>
        <Button type="submit" disabled={pending}>{pending ? "Speichert …" : "Speichern"}</Button>
      </DialogFooter>
    </form>
  )
}

const Field = ({
  label,
  name,
  defaultValue,
  required = false,
  rowKey,
  placeholder,
}: {
  label: string
  name: string
  defaultValue?: string | null
  required?: boolean
  rowKey?: number
  placeholder?: string
}) => {
  const id = rowKey === undefined ? name : `${name}-${rowKey}`
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder} />
    </div>
  )
}

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

export const EditCompanyDialog = ({ company }: { company: CompanyFormValues & { id: string; logoKey: string | null } }) => {
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
        <CompanyLogoField companyId={company.id} logoKey={company.logoKey} hasWebsite={Boolean(company.website)} />
        <CompanyFields key={formKey} company={company} action={saveCompanyAction.bind(null, company.id)} onSaved={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
