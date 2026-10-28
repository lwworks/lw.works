import { ContactsPage } from '@/components/pages/contacts'

// Static mock content, so the page itself is the instant loading state. Switch to a skeleton once it loads data.
export default function Loading() {
  return <ContactsPage />
}
