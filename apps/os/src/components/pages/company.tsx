import { CompanyDetails } from "@/components/companies/company-details"
import { CompanyFinances } from "@/components/finance/company-finances"
import type { CompanyDetail } from "@/lib/db/companies/get-company"
import type { CompanyFinances as CompanyFinancesData } from "@/lib/finance/get-company-finances"
import { Layout } from "../molecules/layout"

export const CompanyPage = ({ company, finances }: { company: CompanyDetail; finances: CompanyFinancesData | null }) => {
  return (
    <Layout>
      <CompanyDetails company={company} />
      {finances ? <CompanyFinances companyId={company.id} finances={finances} /> : null}
    </Layout>
  )
}
