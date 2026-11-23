import { CompanyDetails } from "@/components/companies/company-details"
import { CompanyFinances } from "@/components/finance/company-finances"
import { NotesSection } from "@/components/notes/notes-section"
import type { TimelineItem } from "@/lib/contacts/build-contact-timeline"
import type { CompanyDetail } from "@/lib/db/companies/get-company"
import type { CompanyFinances as CompanyFinancesData } from "@/lib/finance/get-company-finances"
import { Layout } from "../molecules/layout"

export const CompanyPage = ({
  company,
  finances,
  timeline,
}: {
  company: CompanyDetail
  finances: CompanyFinancesData | null
  timeline: TimelineItem[]
}) => {
  return (
    <Layout>
      <CompanyDetails company={company} />
      {finances ? <CompanyFinances companyId={company.id} finances={finances} /> : null}
      <section>
        <NotesSection target={{ type: "company", id: company.id }} subject="Unternehmen" timeline={timeline} />
      </section>
    </Layout>
  )
}
