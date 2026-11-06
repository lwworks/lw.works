import { ContactsTable } from "@/components/contacts/table"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import type { ContactListItem } from "@/lib/db/contacts/list-visible-contacts"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { Layout } from "../molecules/layout"

export const ContactsPage = ({
  contacts,
  companies,
  tags,
  needsContactsScope,
  proxied,
}: {
  contacts: ContactListItem[]
  companies: CompanyListItem[]
  tags: TagListItem[]
  needsContactsScope: boolean
  proxied: boolean
}) => {
  return (
    <Layout>
      <ContactsTable contacts={contacts} companies={companies} tags={tags} needsContactsScope={needsContactsScope} proxied={proxied} />
    </Layout>
  )
}
