import type { IsoWeek } from '@/lib/iso-week/iso-week'

export const isSameIsoWeek = (a: IsoWeek, b: IsoWeek) => a.year === b.year && a.week === b.week
