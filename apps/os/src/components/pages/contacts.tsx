import { ContactsTable } from "@/components/contacts/table"
import type { ContactListItem } from "@/lib/db/contacts/list-visible-contacts"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { Layout } from "../molecules/layout"

export const ContactsPage = ({
  contacts,
  tags,
  needsContactsScope,
  proxied,
}: {
  contacts: ContactListItem[]
  tags: TagListItem[]
  needsContactsScope: boolean
  proxied: boolean
}) => {
  return (
    <Layout>
      <ContactsTable contacts={contacts} tags={tags} needsContactsScope={needsContactsScope} proxied={proxied} />
    </Layout>
  )
}
