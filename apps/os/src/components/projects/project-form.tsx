"use client"

import type { ProjectContactOption } from "@/lib/db/contacts/list-project-contact-options"
import type { ProjectBilling, ProjectStatus } from "@/lib/db/schema/projects"
import { formatContactName } from "@/lib/contacts/format-contact-name"
import { formatCentsInput } from "@/lib/projects/format-cents-input"
import { projectStatusLabel } from "@/lib/projects/project-status-label"
import { Button } from "@lw/ui/components/button"
import { Checkbox } from "@lw/ui/components/checkbox"
import { Input } from "@lw/ui/components/input"
import { Label } from "@lw/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@lw/ui/components/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lw/ui/components/select"
import { Textarea } from "@lw/ui/components/textarea"
import { cn } from "@lw/ui/lib/utils"
import { useActionState, useEffect, useState } from "react"

export type ProjectFormValues = {
  key: string
  title: string
  description: string | null
  status: ProjectStatus
  startDate: string | null
  endDate: string | null
  companyId: string
  billing: ProjectBilling
  hourlyRateCents: number | null
  fixedPriceCents: number | null
  retainerAmountCents: number | null
  retainerHours: number | null
  contactIds: string[]
}

type ActionState = { ok: true } | { ok: false; message: string } | null

const STATUSES: ProjectStatus[] = ["planning", "active", "completed"]
const BILLINGS: { value: ProjectBilling; label: string }[] = [
  { value: "hourly", label: "Stundenbasiert" },
  { value: "fixed", label: "Festpreis" },
  { value: "retainer", label: "Retainer" },
]

const centsValue = (cents: number | null | undefined) => (cents == null ? "" : formatCentsInput(cents))

/**
 * Create (no `project`) or edit a project. Key and customer can only be set on create.
 * Contact persons are the non-private contacts of the customer.
 */
export const ProjectForm = ({
  project,
  companies,
  companyName,
  contactOptions,
  action,
  onSaved,
}: {
  project?: ProjectFormValues
  companies?: { id: string; name: string }[]
  companyName?: string
  contactOptions: ProjectContactOption[]
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  onSaved?: () => void
}) => {
  const creating = !project
  const [state, formAction, pending] = useActionState(action, null)
  const [companyId, setCompanyId] = useState(project?.companyId ?? "")
  const [billing, setBilling] = useState<ProjectBilling>(project?.billing ?? "hourly")
  const companyContacts = contactOptions.filter((option) => option.companyId === companyId)

  useEffect(() => {
    if (state && state.ok) onSaved?.()
  }, [state, onSaved])

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-4")}
      onReset={(event) => {
        // React resets the form after every action, including a failed save.
        event.preventDefault()
      }}
    >
      <div className={cn("grid gap-3 sm:grid-cols-[1fr_8rem]")}>
        <Field label="Titel" htmlFor="title">
          <Input id="title" name="title" defaultValue={project?.title} required maxLength={200} />
        </Field>
        <Field label="Kürzel" htmlFor="key" hint={creating ? "Fest nach dem Anlegen." : undefined}>
          {creating ? (
            <Input
              id="key"
              name="key"
              required
              maxLength={6}
              pattern="[A-Za-z][A-Za-z0-9]{1,5}"
              autoComplete="off"
              className={cn("font-mono uppercase")}
              placeholder="BR"
            />
          ) : (
            <Input id="key" value={project.key} readOnly disabled className={cn("font-mono")} />
          )}
        </Field>
      </div>

      <Field label="Kunde" htmlFor="companyId">
        {creating ? (
          <Select name="companyId" value={companyId} onValueChange={setCompanyId} required>
            <SelectTrigger id="companyId" className={cn("w-full")}>
              <SelectValue placeholder="Kunde wählen" />
            </SelectTrigger>
            <SelectContent>
              {(companies ?? []).map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input id="companyId" value={companyName ?? ""} readOnly disabled />
        )}
      </Field>

      <fieldset className={cn("flex flex-col gap-1.5")}>
        <legend className={cn("mb-1.5 text-sm font-medium text-black dark:text-white")}>Ansprechpartner</legend>
        {!companyId ? <p className={cn("text-sm")}>Zuerst einen Kunden wählen.</p> : null}
        {companyId && companyContacts.length === 0 ? <p className={cn("text-sm")}>Der Kunde hat keine nicht-privaten Kontakte.</p> : null}
        {companyContacts.map((contact) => (
          <label key={`${companyId}-${contact.id}`} className={cn("flex items-center gap-2 text-sm")}>
            <Checkbox name="contactIds" value={contact.id} defaultChecked={project?.contactIds.includes(contact.id)} />
            <span>{formatContactName(contact.firstName, contact.lastName)}</span>
          </label>
        ))}
      </fieldset>

      <div className={cn("grid gap-3 sm:grid-cols-3")}>
        <Field label="Status" htmlFor="status">
          <Select name="status" defaultValue={project?.status ?? "planning"}>
            <SelectTrigger id="status" className={cn("w-full")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {projectStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Start" htmlFor="startDate">
          <Input id="startDate" name="startDate" type="date" defaultValue={project?.startDate ?? ""} />
        </Field>
        <Field label="Ende" htmlFor="endDate">
          <Input id="endDate" name="endDate" type="date" defaultValue={project?.endDate ?? ""} />
        </Field>
      </div>

      <fieldset className={cn("flex flex-col gap-3")}>
        <legend className={cn("mb-1.5 text-sm font-medium text-black dark:text-white")}>Abrechnung</legend>
        <RadioGroup name="billing" value={billing} onValueChange={(value) => setBilling(value as ProjectBilling)} className={cn("flex flex-wrap gap-4")}>
          {BILLINGS.map((option) => (
            <label key={option.value} className={cn("flex items-center gap-2 text-sm")}>
              <RadioGroupItem value={option.value} />
              <span>{option.label}</span>
            </label>
          ))}
        </RadioGroup>
        {billing === "hourly" ? (
          <Field label="Stundensatz (€ netto)" htmlFor="hourlyRate">
            <Input id="hourlyRate" name="hourlyRate" inputMode="decimal" required defaultValue={centsValue(project?.hourlyRateCents)} placeholder="95,00" />
          </Field>
        ) : null}
        {billing === "fixed" ? (
          <Field label="Festpreis (€ netto)" htmlFor="fixedPrice">
            <Input id="fixedPrice" name="fixedPrice" inputMode="decimal" required defaultValue={centsValue(project?.fixedPriceCents)} placeholder="12.000,00" />
          </Field>
        ) : null}
        {billing === "retainer" ? (
          <div className={cn("grid gap-3 sm:grid-cols-2")}>
            <Field label="Betrag pro Monat (€ netto)" htmlFor="retainerAmount">
              <Input
                id="retainerAmount"
                name="retainerAmount"
                inputMode="decimal"
                required
                defaultValue={centsValue(project?.retainerAmountCents)}
                placeholder="2.500,00"
              />
            </Field>
            <Field label="Stunden pro Monat" htmlFor="retainerHours">
              <Input id="retainerHours" name="retainerHours" type="number" min={1} step={1} required defaultValue={project?.retainerHours ?? ""} />
            </Field>
          </div>
        ) : null}
      </fieldset>

      <Field label="Beschreibung" htmlFor="description">
        <Textarea id="description" name="description" defaultValue={project?.description ?? ""} rows={4} maxLength={5000} />
      </Field>

      {state && !state.ok ? <p className={cn("text-sm text-destructive")}>{state.message}</p> : null}
      <div className={cn("flex justify-end")}>
        <Button type="submit" disabled={pending}>
          {pending ? "Speichert …" : creating ? "Projekt anlegen" : "Speichern"}
        </Button>
      </div>
    </form>
  )
}

const Field = ({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) => (
  <div className={cn("flex flex-col gap-1.5")}>
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
    {hint ? <p className={cn("text-xs text-muted-foreground")}>{hint}</p> : null}
  </div>
)
