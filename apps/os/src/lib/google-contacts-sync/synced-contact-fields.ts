import type { ContactLabeledValue } from '@/lib/db/schema/crm'

/** The only fields Google Contacts mirrors. Company, tags, social profiles, avatar, display id, and Privat are absent. */
export type SyncedContactFields = {
  firstName: string
  lastName: string
  emails: ContactLabeledValue[]
  /** Phone numbers other than WhatsApp. */
  phones: ContactLabeledValue[]
  whatsApp: string | null
  birthday: { month: number; day: number; year?: number } | null
}
