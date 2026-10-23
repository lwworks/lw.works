import { describe, expect, it } from 'vitest'
import { getCurrentIsoWeek } from '@/lib/iso-week/get-current-iso-week'
import { getIsoWeekRange } from '@/lib/iso-week/get-iso-week-range'
import { formatIsoWeek, parseIsoWeek, shiftIsoWeek } from '@/lib/iso-week/iso-week'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'

const range = (year: number, week: number) => {
  const { start, end } = getIsoWeekRange({ year, week })
  return [start.toISOString(), end.toISOString()]
}

describe('parseIsoWeek', () => {
  it('parses zero-padded weeks and accepts week 53 only when it exists', () => {
    expect(parseIsoWeek('2026-W13')).toEqual({ year: 2026, week: 13 })
    expect(parseIsoWeek('2026-W53')).toEqual({ year: 2026, week: 53 })
    expect(parseIsoWeek('2020-W53')).toEqual({ year: 2020, week: 53 })
    expect(formatIsoWeek({ year: 2026, week: 1 })).toBe('2026-W01')
  })

  it.each([undefined, '', '2026-W00', '2026-W1', '2026-w01', '2026W01', '2021-W53', '2025-W53', '2026-W54'])('rejects %s', (value) => {
    expect(parseIsoWeek(value)).toBeNull()
  })
})

describe('getIsoWeekRange', () => {
  it('spans Monday 00:00 to Monday 00:00 Europe/Berlin across DST changes and year boundaries', () => {
    expect(range(2026, 25)).toEqual(['2026-06-14T22:00:00.000Z', '2026-06-21T22:00:00.000Z'])
    expect(range(2026, 13)).toEqual(['2026-03-22T23:00:00.000Z', '2026-03-29T22:00:00.000Z'])
    expect(range(2026, 43)).toEqual(['2026-10-18T22:00:00.000Z', '2026-10-25T23:00:00.000Z'])
    expect(range(2026, 1)).toEqual(['2025-12-28T23:00:00.000Z', '2026-01-04T23:00:00.000Z'])
    expect(range(2026, 53)).toEqual(['2026-12-27T23:00:00.000Z', '2027-01-03T23:00:00.000Z'])
    expect(range(2020, 53)[0]).toBe('2020-12-27T23:00:00.000Z')
  })
})

describe('toZonedDateKey', () => {
  it('uses the Europe/Berlin calendar date', () => {
    expect(toZonedDateKey(new Date('2026-03-28T23:30:00.000Z'))).toBe('2026-03-29')
    expect(toZonedDateKey(new Date('2026-03-29T22:30:00.000Z'))).toBe('2026-03-30')
  })
})

describe('getCurrentIsoWeek', () => {
  it('uses the Europe/Berlin calendar date, including week 53 and the Monday boundary', () => {
    expect(getCurrentIsoWeek(new Date('2026-06-15T12:00:00.000Z'))).toEqual({ year: 2026, week: 25 })
    expect(getCurrentIsoWeek(new Date('2026-01-04T22:30:00.000Z'))).toEqual({ year: 2026, week: 1 })
    expect(getCurrentIsoWeek(new Date('2026-01-04T23:30:00.000Z'))).toEqual({ year: 2026, week: 2 })
    expect(getCurrentIsoWeek(new Date('2026-12-31T22:30:00.000Z'))).toEqual({ year: 2026, week: 53 })
    expect(getCurrentIsoWeek(new Date('2020-12-31T22:30:00.000Z'))).toEqual({ year: 2020, week: 53 })
  })
})

describe('shiftIsoWeek', () => {
  it('steps across week 53 into the next year and back', () => {
    expect(shiftIsoWeek({ year: 2026, week: 52 }, 1)).toEqual({ year: 2026, week: 53 })
    expect(shiftIsoWeek({ year: 2026, week: 53 }, 1)).toEqual({ year: 2027, week: 1 })
    expect(shiftIsoWeek({ year: 2027, week: 1 }, -1)).toEqual({ year: 2026, week: 53 })
    expect(shiftIsoWeek({ year: 2026, week: 1 }, -1)).toEqual({ year: 2025, week: 52 })
  })
})
