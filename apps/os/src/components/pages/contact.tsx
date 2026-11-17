import { ContactDetails } from "@/components/contacts/contact-details"
import type { TimelineItem } from "@/lib/contacts/build-contact-timeline"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import type { ContactDetail } from "@/lib/db/contacts/get-visible-contact"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { Layout } from "../molecules/layout"

export const ContactPage = ({
  contact,
  companies,
  tags,
  timeline,
}: {
  contact: ContactDetail
  companies: CompanyListItem[]
  tags: TagListItem[]
  timeline: TimelineItem[]
}) => {
  return (
    <Layout>
      <ContactDetails contact={contact} companies={companies} tags={tags} timeline={timeline} />
    </Layout>
  )
}
