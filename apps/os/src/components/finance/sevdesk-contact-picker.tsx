"use client"

import { linkCompanySevdeskContactAction } from "@/app/unternehmen/actions"
import type { SevdeskContactOption } from "@/lib/db/sevdesk-contacts/list-sevdesk-contacts"
import { Button } from "@lw/ui/components/button"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@lw/ui/components/combobox"
import { toast } from "@lw/ui/components/sonner"
import { cn } from "@lw/ui/lib/utils"
import { useState, useTransition } from "react"

const matchesQuery = (contact: SevdeskContactOption, query: string) => {
  const needle = query.trim().toLocaleLowerCase("de")
  return contact.name.toLocaleLowerCase("de").includes(needle) || (contact.customerNumber?.toLocaleLowerCase("de").includes(needle) ?? false)
}

/** Links the company to a SevDesk customer: a suggestion to accept in one click, or any customer from the list. */
export const SevdeskContactPicker = ({
  companyId,
  contacts,
  suggestion,
}: {
  companyId: string
  contacts: SevdeskContactOption[]
  suggestion: SevdeskContactOption | null
}) => {
  const [selected, setSelected] = useState<SevdeskContactOption | null>(null)
  const [pending, startTransition] = useTransition()

  const link = (contact: SevdeskContactOption) =>
    startTransition(async () => {
      const result = await linkCompanySevdeskContactAction(companyId, contact.id)
      if (!result.ok) return void toast.error(result.message)
      toast.success(`Mit ${contact.name} verknüpft.`)
    })

  return (
    <div className={cn("mt-3 flex flex-col gap-3")}>
      {suggestion ? (
        <div className={cn("flex flex-wrap items-center gap-3 text-sm")}>
          <span>
            Vorschlag: <span className={cn("font-medium text-black dark:text-white")}>{suggestion.name}</span>
            {suggestion.customerNumber ? ` · ${suggestion.customerNumber}` : null}
          </span>
          <Button size="sm" disabled={pending} onClick={() => link(suggestion)}>Verknüpfen</Button>
        </div>
      ) : null}
      <div className={cn("flex flex-wrap items-center gap-2")}>
        <div className={cn("w-full max-w-sm")}>
          <Combobox
            items={contacts}
            value={selected}
            onValueChange={setSelected}
            autoHighlight
            isItemEqualToValue={(item, value) => item.id === value.id}
            itemToStringLabel={(item) => item.name}
            filter={matchesQuery}
          >
            <ComboboxInput className={cn("w-full")} placeholder="SevDesk-Kunde suchen" showClear autoComplete="off" aria-label="SevDesk-Kunde" />
            <ComboboxContent>
              <ComboboxList>
                {(contact: SevdeskContactOption) => (
                  <ComboboxItem key={contact.id} value={contact} disabled={contact.companyId !== null && contact.companyId !== companyId}>
                    <span className={cn("flex min-w-0 flex-col")}>
                      <span className={cn("truncate")}>{contact.name}</span>
                      <span className={cn("text-xs text-muted-foreground")}>
                        {[contact.customerNumber, contact.invoiceCount === 1 ? "1 Rechnung" : `${contact.invoiceCount} Rechnungen`, contact.companyName ? `verknüpft mit ${contact.companyName}` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <Button variant="outline" disabled={!selected || pending} onClick={() => selected && link(selected)}>Verknüpfen</Button>
      </div>
    </div>
  )
}
