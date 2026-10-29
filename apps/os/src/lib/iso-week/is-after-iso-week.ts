import { mondayOf, type IsoWeek } from '@/lib/iso-week/iso-week'

export const isAfterIsoWeek = (a: IsoWeek, b: IsoWeek) => mondayOf(a) > mondayOf(b)
