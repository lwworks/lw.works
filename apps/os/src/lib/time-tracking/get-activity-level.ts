export type ActivityLevel = 0 | 1 | 2 | 3 | 4 | 5

const HOUR_MS = 60 * 60 * 1000

/** Intensity of a day: 0 for nothing tracked, then ≤2 h, ≤4 h, ≤6 h, ≤8 h, and >8 h. */
export const getActivityLevel = (ms: number): ActivityLevel => {
  if (ms <= 0) return 0
  if (ms <= 2 * HOUR_MS) return 1
  if (ms <= 4 * HOUR_MS) return 2
  if (ms <= 6 * HOUR_MS) return 3
  if (ms <= 8 * HOUR_MS) return 4
  return 5
}
