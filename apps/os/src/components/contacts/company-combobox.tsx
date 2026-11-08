"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@lw/ui/components/combobox"
import { Input } from "@lw/ui/components/input"
import { Label } from "@lw/ui/components/label"
import { cn } from "@lw/ui/lib/utils"
import { Plus } from "@mynaui/icons-react"
import { useState } from "react"

const newCompany = { id: "new", name: "Neues Unternehmen" }

type CompanyOption = { id: string; name: string }

const matchesQuery = (name: string, query: string) => name.toLocaleLowerCase("de").includes(query.trim().toLocaleLowerCase("de"))

export const CompanyCombobox = ({ companies }: { companies: CompanyOption[] }) => {
  const [value, setValue] = useState<CompanyOption | null>(null)
  const creating = value?.id === newCompany.id

  return (
    <div className={cn("flex flex-col gap-3")}>
      <input type="hidden" name="newCompany" value={creating ? "true" : "false"} />
      <input type="hidden" name="companyId" value={creating || !value ? "" : value.id} />
      <Combobox
        items={[...companies, newCompany]}
        value={value}
        onValueChange={setValue}
        autoHighlight
        isItemEqualToValue={(item, selected) => item.id === selected.id}
        itemToStringLabel={(item) => item.name}
        filter={(item, query) => item.id === newCompany.id || matchesQuery(item.name, query)}
      >
        <ComboboxInput id="companyId" className={cn("w-full")} placeholder="Unternehmen wählen" showClear autoComplete="off" />
        <ComboboxContent>
          <ComboboxList>
            {(company: CompanyOption) => (
              <ComboboxItem
                key={company.id}
                value={company}
                className={cn(company.id === newCompany.id && "border-t border-border")}
              >
                {company.id === newCompany.id ? <Plus strokeWidth={1.5} /> : null}
                <span>{company.name}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {creating ? <NewCompanyFields /> : null}
    </div>
  )
}

const fields = [
  { label: "Name", name: "name", required: true },
  { label: "Logo-URL", name: "logoUrl", required: false },
  { label: "Website", name: "website", required: false },
  { label: "Straße", name: "street", required: false },
  { label: "Postleitzahl", name: "postalCode", required: false },
  { label: "Ort", name: "city", required: false },
  { label: "Land", name: "country", required: false },
] as const

const NewCompanyFields = () => (
  <fieldset className={cn("flex flex-col gap-3 border-t border-border pt-3")}>
    <legend className={cn("text-sm")}>Neues Unternehmen</legend>
    <p className={cn("text-sm text-muted-foreground")}>Wird zusammen mit dem Kontakt gespeichert.</p>
    {fields.map((field) => (
      <div key={field.name} className={cn("flex flex-col gap-1.5")}>
        <Label htmlFor={`company-${field.name}`}>{field.label}</Label>
        <Input id={`company-${field.name}`} name={field.name} required={field.required} />
      </div>
    ))}
  </fieldset>
)
