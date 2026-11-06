import { RemoteImage } from "@/components/atoms/remote-image"
import { CreateCompanyDialog } from "@/components/companies/company-form"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import Link from "next/link"
import { PageHeader } from "../molecules/page-header"

export const CompaniesTable = ({ companies }: { companies: CompanyListItem[] }) => {
  return (
    <section>
      <PageHeader title="Unternehmen" description="Firmen für das ganze Team. Sie werden nicht mit Google Kontakte abgeglichen.">
        <CreateCompanyDialog />
      </PageHeader>
      <table className="w-full text-sm">
        <thead>
          <tr className="h-10 border-y border-neutral-200 dark:border-neutral-800">
            <td className="pr-2 pl-16">Name</td>
            <td className="pr-2">Ort</td>
            <td className="pr-16">Website</td>
          </tr>
        </thead>
        <tbody>
          {companies.length === 0 ? (
            <tr className="h-16 border-b border-neutral-200 dark:border-neutral-800">
              <td colSpan={3} className="px-16">Noch keine Unternehmen.</td>
            </tr>
          ) : null}
          {companies.map((company) => (
            <tr key={company.id} className="h-10 border-b border-neutral-200 dark:border-neutral-800">
              <td className="pr-2 pl-16">
                <Link href={`/unternehmen/${company.id}`} className="inline-flex items-center gap-1.5 font-medium text-black hover:underline dark:text-white">
                  {company.logoUrl ? <RemoteImage src={company.logoUrl} alt="" width={14} height={14} className="size-3.5" /> : null}
                  <span>{company.name}</span>
                </Link>
              </td>
              <td className="pr-2">{company.city}</td>
              <td className="pr-16">
                {company.website ? (
                  <a href={company.website} className="hover:underline" rel="noreferrer" target="_blank">{company.website}</a>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
