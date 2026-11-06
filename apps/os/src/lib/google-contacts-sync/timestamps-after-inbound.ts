/**
 * A pull-applied write moves `lastInboundAt` and leaves the OS edit stamp untouched,
 * so the value the cron wrote is not itself an OS edit.
 */
export const timestampsAfterInbound = (contact: { syncedFieldsEditedAt: Date | null }, at: Date) => ({
  syncedFieldsEditedAt: contact.syncedFieldsEditedAt,
  lastInboundAt: at,
})
