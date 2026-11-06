/** Soft-deleted contacts are hidden from everyone, including the creator. Private contacts are creator-only. */
export const isContactVisible = (
  contact: { deletedAt: Date | null; isPrivate: boolean; createdByUserId: string },
  viewerId: string,
) => contact.deletedAt === null && (!contact.isPrivate || contact.createdByUserId === viewerId)
