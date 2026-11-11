import { ContactsTable } from "@/components/contacts/table"
import type { ContactListItem } from "@/lib/db/contacts/list-visible-contacts"
import { Layout } from "../molecules/layout"

export const ContactsPage = ({
  contacts,
  needsContactsScope,
  proxied,
}: {
  contacts: ContactListItem[]
  needsContactsScope: boolean
  proxied: boolean
}) => {
  return (
    <Layout>
      <ContactsTable contacts={contacts} needsContactsScope={needsContactsScope} proxied={proxied} />
    </Layout>
  )
}
