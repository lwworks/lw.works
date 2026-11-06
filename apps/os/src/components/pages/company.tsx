import { CompanyDetails } from "@/components/companies/company-details"
import type { CompanyDetail } from "@/lib/db/companies/get-company"
import { Layout } from "../molecules/layout"

export const CompanyPage = ({ company }: { company: CompanyDetail }) => {
  return (
    <Layout>
      <CompanyDetails company={company} />
    </Layout>
  )
}
