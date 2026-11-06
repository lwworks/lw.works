import type { GoogleCopy } from '@/lib/google-contacts-sync/pick-latest-google-copy'
import { pickLatestGoogleCopy } from '@/lib/google-contacts-sync/pick-latest-google-copy'
import { inboundMayOverwrite } from '@/lib/google-contacts-sync/inbound-may-overwrite'

/** The synced fields a daily pull may write, or null when the pull must leave the OS row alone. */
export const chooseInboundFields = (
  contact: { syncedFieldsEditedAt: Date | null; lastInboundAt: Date | null },
  copies: readonly GoogleCopy[],
) => {
  const chosen = pickLatestGoogleCopy(copies)
  if (!chosen || !inboundMayOverwrite(contact)) return null
  if (!chosen.fields.firstName && !chosen.fields.lastName) return null
  return chosen.fields
}
