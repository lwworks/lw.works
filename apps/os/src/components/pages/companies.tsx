import { CompaniesTable } from "@/components/companies/table"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import { Layout } from "../molecules/layout"

export const CompaniesPage = ({ companies }: { companies: CompanyListItem[] }) => {
  return (
    <Layout>
      <CompaniesTable companies={companies} />
    </Layout>
  )
}
