/** Total duration of the entries; running entries count up to `now`. */
export const sumTrackedMs = (entries: { startAt: Date; endAt: Date }[], now: Date) =>
  entries.reduce((sum, { startAt, endAt }) => sum + Math.max(0, Math.min(endAt.getTime(), now.getTime()) - startAt.getTime()), 0)
