import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'

export type GoogleCopy = { updateTime: string; fields: SyncedContactFields }

/** When members' Google copies disagree, the latest `updateTime` wins. The cron still does not push it. */
export const pickLatestGoogleCopy = (copies: readonly GoogleCopy[]) => {
  if (copies.length === 0) return null
  return copies.reduce((latest, copy) => (copy.updateTime > latest.updateTime ? copy : latest))
}
