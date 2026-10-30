export type ActivityLevel = 0 | 1 | 2 | 3 | 4

const HOUR_MS = 60 * 60 * 1000
/** Upper bounds (hours, inclusive) of levels 1–3; anything above the last is level 4. */
const LEVEL_HOURS = [2, 4, 6]

/** Intensity of a day in the activity chart: 0 for nothing tracked, up to 4 for more than 6 hours. */
export const getActivityLevel = (ms: number): ActivityLevel =>
  ms <= 0 ? 0 : ((1 + LEVEL_HOURS.filter((hours) => ms > hours * HOUR_MS).length) as ActivityLevel)
