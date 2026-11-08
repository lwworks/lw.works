import { CompanyCombobox } from "@/components/contacts/company-combobox"
import { listCompanies } from "@/lib/db/companies/list-companies"
import { listTags } from "@/lib/db/tags/list-tags"
import { tagSwatchColor } from "@/lib/tags/tag-swatch-color"

export const CompanySelect = async () => {
  const companies = await listCompanies()
  return <CompanyCombobox companies={companies.map(({ id, name }) => ({ id, name }))} />
}

export const TagChoices = async () => {
  const tags = await listTags()
  if (tags.length === 0) return <p className="text-sm">Noch keine Tags.</p>
  return (
    <div className="flex max-h-32 flex-col gap-1.5 overflow-y-auto">
      {tags.map((tag) => (
        <label key={tag.id} className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="tagIds" value={tag.id} className="size-4 accent-black" />
          <span className="size-2 rounded-full" style={{ backgroundColor: tagSwatchColor(tag.color) }} />
          <span>{tag.name}</span>
        </label>
      ))}
    </div>
  )
}
