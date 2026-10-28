import { ContactDetails, ContactDetailsSkeleton } from "../contacts/contact-details"
import { Layout } from "../molecules/layout"

export const ContactPage = () => {
  return (
    <Layout>
      <ContactDetails />
    </Layout>
  )
}

export const ContactPageSkeleton = () => {
  return (
    <Layout>
      <ContactDetailsSkeleton />
    </Layout>
  )
}
