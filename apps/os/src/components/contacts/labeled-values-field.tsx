"use client"

import { NO_VALUE_TYPE } from "@/lib/contacts/read-labeled-values"
import { formatValueType } from "@/lib/contacts/format-value-type"
import type { ContactLabeledValue } from "@/lib/db/schema/crm"
import { Button } from "@lw/ui/components/button"
import { Input } from "@lw/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lw/ui/components/select"
import { cn } from "@lw/ui/lib/utils"
import { Plus, Trash } from "@mynaui/icons-react"
import { useState } from "react"

let nextRowKey = 0
const withKey = (entry: ContactLabeledValue) => ({ key: nextRowKey++, entry })

/**
 * Repeated value + type rows, submitted as `<name>Value` / `<name>Type` in order. The first row is the primary one.
 * A type that is not in `types` (a custom label from Google) stays selectable for its row.
 */
export const LabeledValuesField = ({
  name,
  label,
  addLabel,
  types,
  defaultType,
  values,
  inputType = "text",
}: {
  name: "email" | "phone"
  label: string
  addLabel: string
  types: readonly string[]
  defaultType: string
  values?: ContactLabeledValue[]
  inputType?: "email" | "tel" | "text"
}) => {
  const [rows, setRows] = useState(() => (values && values.length > 0 ? values : [{ value: "", type: defaultType }]).map(withKey))

  return (
    <fieldset className={cn("flex flex-col gap-1.5")}>
      <legend className={cn("mb-1.5 text-sm")}>{label}</legend>
      {rows.map(({ key, entry }, index) => {
        const options = entry.type && !types.includes(entry.type) ? [...types, entry.type] : types
        return (
          <div key={key} className={cn("flex items-center gap-2")}>
            <Select name={`${name}Type`} defaultValue={entry.type ?? NO_VALUE_TYPE}>
              <SelectTrigger aria-label={`Typ ${label} ${index + 1}`} className={cn("w-32 shrink-0")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((type) => (
                  <SelectItem key={type} value={type}>{formatValueType(type)}</SelectItem>
                ))}
                <SelectItem value={NO_VALUE_TYPE}>Ohne Typ</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name={`${name}Value`}
              type={inputType}
              aria-label={`${label} ${index + 1}`}
              defaultValue={entry.value}
              className={cn("min-w-0 flex-1")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`${label} ${index + 1} entfernen`}
              disabled={rows.length === 1}
              onClick={() => setRows((current) => current.filter((row) => row.key !== key))}
            >
              <Trash strokeWidth={1.5} className={cn("size-4")} />
            </Button>
          </div>
        )
      })}
      <div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setRows((current) => [...current, withKey({ value: "", type: defaultType })])}>
          <Plus strokeWidth={1.5} className={cn("size-4")} />
          <span>{addLabel}</span>
        </Button>
      </div>
    </fieldset>
  )
}
