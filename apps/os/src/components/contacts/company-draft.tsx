"use client"

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"

export type CompanyFields = {
  name: string
  logoUrl: string
  website: string
  street: string
  postalCode: string
  city: string
  country: string
}

export type CompanySelection = { id: string; name: string } | null

type CompanyDraft = {
  selected: CompanySelection
  fields: CompanyFields
}

const emptyFields = (): CompanyFields => ({
  name: "",
  logoUrl: "",
  website: "",
  street: "",
  postalCode: "",
  city: "",
  country: "",
})

const CompanyDraftContext = createContext<{
  draft: CompanyDraft
  setDraft: Dispatch<SetStateAction<CompanyDraft>>
} | null>(null)

export const CompanyDraftProvider = ({ children }: { children: ReactNode }) => {
  const [draft, setDraft] = useState<CompanyDraft>({ selected: null, fields: emptyFields() })
  return <CompanyDraftContext.Provider value={{ draft, setDraft }}>{children}</CompanyDraftContext.Provider>
}

export const useCompanyDraft = () => useContext(CompanyDraftContext)
