export type RevenuePreset = '12m' | 'jahr' | 'vorjahr' | 'alles' | 'frei'

/** Months `from`–`to` (`YYYY-MM`, both included). */
export type RevenueRange = { preset: RevenuePreset; from: string; to: string }
