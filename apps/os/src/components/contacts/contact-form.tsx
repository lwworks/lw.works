"use client"

import { saveContactAction } from "@/app/kontakte/actions"
import { CompanyDraftProvider, type CompanyDraft } from "@/components/contacts/company-draft"
import { LabeledValuesField } from "@/components/contacts/labeled-values-field"
import { TagPickerField } from "@/components/tags/tag-picker-field"
import { EMAIL_TYPES, PHONE_TYPES } from "@/lib/contacts/value-types"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import type { ContactLabeledValue } from "@/lib/db/schema/crm"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { Button } from "@lw/ui/components/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@lw/ui/components/dialog"
import { Input } from "@lw/ui/components/input"
import { Label } from "@lw/ui/components/label"
import { Switch } from "@lw/ui/components/switch"
import { cn } from "@lw/ui/lib/utils"
import { Pencil } from "@mynaui/icons-react"
import { useActionState, useEffect, useRef, useState } from "react"

export type ContactFormValues = {
  displayId?: number
  firstName: string
  lastName: string
  emails: ContactLabeledValue[]
  phones: ContactLabeledValue[]
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

type FormSnapshot = {
  entries: [string, string][]
  companyLabel: string
}

const snapshotForm = (form: HTMLFormElement): FormSnapshot => {
  const entries: [string, string][] = []
  for (const [key, value] of new FormData(form).entries()) {
    if (typeof value === "string") entries.push([key, value])
  }
  const companyInput = form.querySelector<HTMLInputElement>("#companyId")
  return { entries, companyLabel: companyInput?.value ?? "" }
}

/** Puts back values a failed save cleared. Leaves a field alone when the user still has something in it. */
const restoreClearedFields = (form: HTMLFormElement, snapshot: FormSnapshot) => {
  const grouped = new Map<string, string[]>()
  for (const [key, value] of snapshot.entries) {
    const list = grouped.get(key) ?? []
    list.push(value)
    grouped.set(key, list)
  }
  const seen = new Set<string>()
  const positions = new Map<string, number>()
  for (const element of form.elements) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) continue
    if (!element.name) continue
    const list = grouped.get(element.name) ?? []
    if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
      if (seen.has(element.name)) continue
      seen.add(element.name)
      const boxes = form.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${CSS.escape(element.name)}"], input[type="radio"][name="${CSS.escape(element.name)}"]`)
      const anyChecked = [...boxes].some((box) => box.checked)
      if (!anyChecked && list.length > 0) {
        for (const box of boxes) box.checked = list.includes(box.value)
      }
      continue
    }
    // Repeated names (emailValue, phoneValue, …) are restored by position.
    const position = positions.get(element.name) ?? 0
    positions.set(element.name, position + 1)
    const previous = list[position]
    if (element.value === "" && previous) element.value = previous
  }
  const companyInput = form.querySelector<HTMLInputElement>("#companyId")
  if (companyInput && companyInput.value === "" && snapshot.companyLabel) companyInput.value = snapshot.companyLabel
}

export const ContactForm = ({
  companies = [],
  tags = [],
  contact,
  action,
  onSaved,
  canTogglePrivacy = true,
  layout = "dialog",
  companyField,
  tagsField,
  initialCompany,
}: {
  companies?: CompanyListItem[]
  tags?: TagListItem[]
  contact?: ContactFormValues
  action: (prev: { ok: true } | { ok: false; message: string } | null, formData: FormData) => Promise<{ ok: true } | { ok: false; message: string } | null>
  onSaved?: () => void
  canTogglePrivacy?: boolean
  layout?: "dialog" | "page"
  companyField?: React.ReactNode
  tagsField?: React.ReactNode
  initialCompany?: CompanyDraft
}) => {
  const [state, formAction, pending] = useActionState(action, null)
  const [isPrivate, setIsPrivate] = useState(contact?.isPrivate ?? false)
  const formRef = useRef<HTMLFormElement>(null)
  const snapshotRef = useRef<FormSnapshot | null>(null)

  useEffect(() => {
    if (state && state.ok) onSaved?.()
  }, [state, onSaved])

  useEffect(() => {
    const form = formRef.current
    const snapshot = snapshotRef.current
    if (!form || !snapshot || !state || state.ok) return
    restoreClearedFields(form, snapshot)
  }, [state])

  return (
    <CompanyDraftProvider initial={initialCompany}>
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        snapshotRef.current = snapshotForm(event.currentTarget)
      }}
      onReset={(event) => {
        // React resets the form after every action, including a failed save.
        event.preventDefault()
      }}
    >
      <input type="hidden" name="isPrivate" value={isPrivate ? "true" : "false"} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Vorname" name="firstName" defaultValue={contact?.firstName} />
        <Field label="Nachname" name="lastName" defaultValue={contact?.lastName} />
      </div>
      <LabeledValuesField name="email" label="E-Mail" addLabel="E-Mail hinzufügen" types={EMAIL_TYPES} defaultType="work" values={contact?.emails} inputType="email" />
      <LabeledValuesField name="phone" label="Telefon" addLabel="Telefonnummer hinzufügen" types={PHONE_TYPES} defaultType="mobile" values={contact?.phones} inputType="tel" />
      <div className="grid gap-3 sm:grid-cols-2">
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
        {companyField ?? (
          <select id="companyId" name="companyId" defaultValue={contact?.companyId ?? ""} className={cn(fieldClass)}>
            <option value="">Kein Unternehmen</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        )}
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm">Tags</legend>
        {tagsField ?? <TagPickerField tags={tags} defaultSelectedIds={contact?.tagIds ?? []} />}
      </fieldset>
      {canTogglePrivacy ? (
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="privat">Privat</Label>
          <Switch id="privat" checked={isPrivate} onCheckedChange={setIsPrivate} />
        </div>
      ) : null}
      {state && !state.ok ? <p className="text-sm text-destructive">{state.message}</p> : null}
      {layout === "page" ? (
        <div className={cn("flex justify-end")}>
          <Button type="submit" disabled={pending}>{pending ? "Speichert …" : "Speichern"}</Button>
        </div>
      ) : (
        <DialogFooter>
          <Button type="submit" disabled={pending}>{pending ? "Speichert …" : "Speichern"}</Button>
        </DialogFooter>
      )}
    </form>
    </CompanyDraftProvider>
  )
}

const Field = ({ label, name, defaultValue, type = "text" }: { label: string; name: string; defaultValue?: string | number | null; type?: string }) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={name}>{label}</Label>
    <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} />
  </div>
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
