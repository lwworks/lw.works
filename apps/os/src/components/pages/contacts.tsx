import { ContactsTable, ContactsTableSkeleton } from "../contacts/table"
import { Layout } from "../molecules/layout"

export const ContactsPage = () => {
  return (
    <Layout>
      <ContactsTable />
    </Layout>
  )
}

export const ContactsPageSkeleton = () => {
  return (
    <Layout>
      <ContactsTableSkeleton />
    </Layout>
  )
}
