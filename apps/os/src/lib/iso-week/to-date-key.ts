/** UTC midnight as `YYYY-MM-DD`. */
export const toDateKey = (utcMidnight: number) => new Date(utcMidnight).toISOString().slice(0, 10)
