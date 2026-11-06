import { ContactDetails } from "@/components/contacts/contact-details"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import type { ContactDetail } from "@/lib/db/contacts/get-visible-contact"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { Layout } from "../molecules/layout"

export const ContactPage = ({
  contact,
  companies,
  tags,
}: {
  contact: ContactDetail
  companies: CompanyListItem[]
  tags: TagListItem[]
}) => {
  return (
    <Layout>
      <ContactDetails contact={contact} companies={companies} tags={tags} />
    </Layout>
  )
}
