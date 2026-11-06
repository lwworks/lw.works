/** True when the daily pull may write synced fields. An OS edit of those fields since the last pull wins. */
export const inboundMayOverwrite = (contact: { syncedFieldsEditedAt: Date | null; lastInboundAt: Date | null }) =>
  contact.syncedFieldsEditedAt === null ||
  (contact.lastInboundAt !== null && contact.syncedFieldsEditedAt.getTime() <= contact.lastInboundAt.getTime())
