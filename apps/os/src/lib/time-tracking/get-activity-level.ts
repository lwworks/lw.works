export type ActivityLevel = 0 | 1 | 2 | 3 | 4 | 5

const HOUR_MS = 60 * 60 * 1000
/** Upper bounds (hours, inclusive) of levels 1–4; anything above the last is level 5. */
const LEVEL_HOURS = [2, 4, 6, 8]

/** Intensity of a day: 0 for nothing tracked, then ≤2 h, ≤4 h, ≤6 h, ≤8 h, and >8 h. */
export const getActivityLevel = (ms: number): ActivityLevel =>
  ms <= 0 ? 0 : ((1 + LEVEL_HOURS.filter((hours) => ms > hours * HOUR_MS).length) as ActivityLevel)
