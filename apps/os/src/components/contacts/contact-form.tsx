"use client"

import { createContactAction, saveContactAction } from "@/app/kontakte/actions"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { tagSwatchColor } from "@/lib/tags/tag-swatch-color"
import { Button } from "@lw/ui/components/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@lw/ui/components/dialog"
import { Input } from "@lw/ui/components/input"
import { Label } from "@lw/ui/components/label"
import { Switch } from "@lw/ui/components/switch"
import { cn } from "@lw/ui/lib/utils"
import { Pencil, Plus } from "@mynaui/icons-react"
import { useActionState, useEffect, useState } from "react"

export type ContactFormValues = {
  displayId?: number
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  whatsApp: string | null
  linkedIn: string | null
  instagram: string | null
  x: string | null
  avatarUrl: string | null
  birthday: { month: number; day: number; year?: number } | null
  companyId: string | null
  tagIds: string[]
  isPrivate: boolean
}

const fieldClass = "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-black outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:text-white"

export const ContactForm = ({
  companies,
  tags,
  contact,
  action,
  onSaved,
  canTogglePrivacy = true,
}: {
  companies: CompanyListItem[]
  tags: TagListItem[]
  contact?: ContactFormValues
  action: (prev: { ok: true } | { ok: false; message: string } | null, formData: FormData) => Promise<{ ok: true } | { ok: false; message: string } | null>
  onSaved?: () => void
  canTogglePrivacy?: boolean
}) => {
  const [state, formAction, pending] = useActionState(action, null)
  const [isPrivate, setIsPrivate] = useState(contact?.isPrivate ?? false)
  const selected = new Set(contact?.tagIds ?? [])

  useEffect(() => {
    if (state && state.ok) onSaved?.()
  }, [state, onSaved])

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="isPrivate" value={isPrivate ? "true" : "false"} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Vorname" name="firstName" defaultValue={contact?.firstName} />
        <Field label="Nachname" name="lastName" defaultValue={contact?.lastName} />
        <Field label="E-Mail" name="email" type="email" defaultValue={contact?.email} />
        <Field label="Telefon" name="phone" defaultValue={contact?.phone} />
        <Field label="WhatsApp" name="whatsApp" defaultValue={contact?.whatsApp} />
        <Field label="Avatar-URL" name="avatarUrl" defaultValue={contact?.avatarUrl} />
        <Field label="LinkedIn" name="linkedIn" defaultValue={contact?.linkedIn} />
        <Field label="Instagram" name="instagram" defaultValue={contact?.instagram} />
        <Field label="X" name="x" defaultValue={contact?.x} />
      </div>
      <fieldset className="grid grid-cols-3 gap-2">
        <legend className="mb-1 text-sm">Geburtstag</legend>
        <Field label="Tag" name="birthdayDay" defaultValue={contact?.birthday?.day} />
        <Field label="Monat" name="birthdayMonth" defaultValue={contact?.birthday?.month} />
        <Field label="Jahr" name="birthdayYear" defaultValue={contact?.birthday?.year} />
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="companyId">Unternehmen</Label>
        <select id="companyId" name="companyId" defaultValue={contact?.companyId ?? ""} className={cn(fieldClass)}>
          <option value="">Kein Unternehmen</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm">Tags</legend>
        {tags.length === 0 ? <p className="text-sm">Noch keine Tags.</p> : null}
        <div className="flex max-h-32 flex-col gap-1.5 overflow-y-auto">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="tagIds" value={tag.id} defaultChecked={selected.has(tag.id)} className="size-4 accent-black" />
              <span className="size-2 rounded-full" style={{ backgroundColor: tagSwatchColor(tag.color) }} />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {canTogglePrivacy ? (
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="privat">Privat</Label>
          <Switch id="privat" checked={isPrivate} onCheckedChange={setIsPrivate} />
        </div>
      ) : null}
      {state && !state.ok ? <p className="text-sm text-destructive">{state.message}</p> : null}
      <DialogFooter>
        <Button type="submit" disabled={pending}>{pending ? "Speichert …" : "Speichern"}</Button>
      </DialogFooter>
    </form>
  )
}

const Field = ({ label, name, defaultValue, type = "text" }: { label: string; name: string; defaultValue?: string | number | null; type?: string }) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={name}>{label}</Label>
    <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} />
  </div>
)

export const CreateContactDialog = ({ companies, tags }: { companies: CompanyListItem[]; tags: TagListItem[] }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>
        <Plus strokeWidth={1.5} className="size-4" />
        <span>Neuer Kontakt</span>
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Neuer Kontakt</DialogTitle>
      </DialogHeader>
      <ContactForm companies={companies} tags={tags} action={createContactAction} />
    </DialogContent>
  </Dialog>
)

export const EditContactDialog = ({
  companies,
  tags,
  contact,
  canTogglePrivacy,
}: {
  companies: CompanyListItem[]
  tags: TagListItem[]
  contact: ContactFormValues & { displayId: number }
  canTogglePrivacy: boolean
}) => {
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
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kontakt bearbeiten</DialogTitle>
        </DialogHeader>
        <ContactForm
          key={formKey}
          companies={companies}
          tags={tags}
          contact={contact}
          action={saveContactAction.bind(null, contact.displayId)}
          onSaved={() => setOpen(false)}
          canTogglePrivacy={canTogglePrivacy}
        />
      </DialogContent>
    </Dialog>
  )
}
