"use client"

import { createContactAction } from "@/app/kontakte/actions"
import { BusinessCardScan } from "@/components/contacts/business-card-scan"
import type { CompanyDraft } from "@/components/contacts/company-draft"
import { ContactForm, type ContactFormValues } from "@/components/contacts/contact-form"
import type { ContactPrefill } from "@/lib/business-card/to-contact-prefill"
import { cn } from "@lw/ui/lib/utils"
import { useState } from "react"

const emptyCompanyFields = { name: "", website: "", street: "", postalCode: "", city: "", country: "" }

const toFormValues = (prefill: ContactPrefill): ContactFormValues => ({
  firstName: prefill.firstName,
  lastName: prefill.lastName,
  emails: prefill.emails,
  phones: prefill.phones,
  whatsApp: null,
  linkedIn: prefill.linkedIn,
  instagram: prefill.instagram,
  x: prefill.x,
  avatarUrl: null,
  birthday: null,
  companyId: null,
  tagIds: [],
  isPrivate: false,
})

const toCompanyDraft = (prefill: ContactPrefill): CompanyDraft | undefined => {
  if (!prefill.company) return undefined
  if (prefill.company.kind === "existing") {
    return { selected: { id: prefill.company.id, name: prefill.company.name }, fields: emptyCompanyFields }
  }
  return { selected: { id: "new", name: "Neues Unternehmen" }, fields: prefill.company.fields }
}

/** New-contact form with a business card scan that refills it. Each scan remounts the form with the read values. */
export const NewContactForm = ({ companyField, tagsField }: { companyField: React.ReactNode; tagsField: React.ReactNode }) => {
  const [prefill, setPrefill] = useState<{ key: number; value: ContactPrefill } | null>(null)

  return (
    <>
      <div className={cn("border-b border-neutral-200 px-4 py-8 sm:px-8 lg:px-16 dark:border-neutral-800")}>
        <BusinessCardScan onRead={(value) => setPrefill((current) => ({ key: (current?.key ?? 0) + 1, value }))} />
      </div>
      <div className={cn("max-w-lg px-4 py-8 sm:px-8 lg:px-16")}>
        <ContactForm
          key={prefill?.key ?? 0}
          action={createContactAction}
          layout="page"
          contact={prefill ? toFormValues(prefill.value) : undefined}
          initialCompany={prefill ? toCompanyDraft(prefill.value) : undefined}
          companyField={companyField}
          tagsField={tagsField}
        />
      </div>
    </>
  )
}
