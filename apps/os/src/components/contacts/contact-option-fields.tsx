import { CompanyCombobox } from "@/components/contacts/company-combobox"
import { TagPickerField } from "@/components/tags/tag-picker-field"
import { listCompanies } from "@/lib/db/companies/list-companies"
import { listTags } from "@/lib/db/tags/list-tags"

export const CompanySelect = async () => {
  const companies = await listCompanies()
  return <CompanyCombobox companies={companies.map(({ id, name }) => ({ id, name }))} />
}

export const TagChoices = async () => {
  const tags = await listTags()
  return <TagPickerField tags={tags} />
}
