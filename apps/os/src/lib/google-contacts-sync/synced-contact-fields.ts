/** The only fields Google Contacts mirrors. Company, tags, social profiles, avatar, display id, and Privat are absent. */
export type SyncedContactFields = {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  whatsApp: string | null
  birthday: { month: number; day: number; year?: number } | null
}
