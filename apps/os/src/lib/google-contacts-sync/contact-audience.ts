/** Privat on: the creator only, and only when they are a member. Privat off: every member id passed in. */
export const contactAudience = ({
  isPrivate,
  createdByUserId,
  memberIds,
}: {
  isPrivate: boolean
  createdByUserId: string
  memberIds: readonly string[]
}) => (isPrivate ? memberIds.filter((id) => id === createdByUserId) : [...memberIds])
