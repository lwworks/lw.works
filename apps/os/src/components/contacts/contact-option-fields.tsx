import { listCompanies } from "@/lib/db/companies/list-companies"
import { listTags } from "@/lib/db/tags/list-tags"
import { tagSwatchColor } from "@/lib/tags/tag-swatch-color"
import { cn } from "@lw/ui/lib/utils"

const fieldClass = "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-black outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:text-white"

export const CompanySelect = async () => {
  const companies = await listCompanies()
  return (
    <select id="companyId" name="companyId" defaultValue="" className={cn(fieldClass)}>
      <option value="">Kein Unternehmen</option>
      {companies.map((company) => (
        <option key={company.id} value={company.id}>{company.name}</option>
      ))}
    </select>
  )
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
