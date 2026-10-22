import { describe, expect, it } from 'vitest'
import { formatIsoWeek, getCurrentIsoWeek, getIsoWeekRange, parseIsoWeek, shiftIsoWeek, toZonedDateKey, zonedMidnight } from './week'

const HOUR_MS = 60 * 60 * 1000

describe('parseIsoWeek', () => {
  it('parses a zero-padded ISO week', () => {
    expect(parseIsoWeek('2026-W13')).toEqual({ year: 2026, week: 13 })
    expect(formatIsoWeek({ year: 2026, week: 1 })).toBe('2026-W01')
    expect(formatIsoWeek({ year: 2026, week: 53 })).toBe('2026-W53')
  })

  it('accepts week 53 only when that week exists', () => {
    expect(parseIsoWeek('2026-W53')).toEqual({ year: 2026, week: 53 })
    expect(parseIsoWeek('2020-W53')).toEqual({ year: 2020, week: 53 })
    expect(parseIsoWeek('2021-W53')).toBeNull()
    expect(parseIsoWeek('2025-W53')).toBeNull()
    expect(parseIsoWeek('2026-W54')).toBeNull()
  })

  it('rejects malformed values and week 0', () => {
    expect(parseIsoWeek(undefined)).toBeNull()
    expect(parseIsoWeek('')).toBeNull()
    expect(parseIsoWeek('2026-W00')).toBeNull()
    expect(parseIsoWeek('2026-W1')).toBeNull()
    expect(parseIsoWeek('2026-w01')).toBeNull()
    expect(parseIsoWeek('2026W01')).toBeNull()
  })
})

describe('getIsoWeekRange', () => {
  it('uses Monday 00:00 Europe/Berlin as a half-open week', () => {
    const range = getIsoWeekRange({ year: 2026, week: 25 })
    expect(range.start.toISOString()).toBe('2026-06-14T22:00:00.000Z')
    expect(range.end.toISOString()).toBe('2026-06-21T22:00:00.000Z')
    expect(range.dayKeys).toEqual([
      '2026-06-15',
      '2026-06-16',
      '2026-06-17',
      '2026-06-18',
      '2026-06-19',
      '2026-06-20',
      '2026-06-21',
    ])
    expect(toZonedDateKey(range.end)).toBe('2026-06-22')
    expect(range.end.getTime() - range.start.getTime()).toBe(7 * 24 * HOUR_MS)
  })

  it('shortens the week that contains the spring-forward DST change', () => {
    const range = getIsoWeekRange({ year: 2026, week: 13 })
    expect(range.dayKeys).toEqual([
      '2026-03-23',
      '2026-03-24',
      '2026-03-25',
      '2026-03-26',
      '2026-03-27',
      '2026-03-28',
      '2026-03-29',
    ])
    expect(range.start.toISOString()).toBe('2026-03-22T23:00:00.000Z')
    expect(range.end.toISOString()).toBe('2026-03-29T22:00:00.000Z')
    expect(range.end.getTime() - range.start.getTime()).toBe(7 * 24 * HOUR_MS - HOUR_MS)
  })

  it('lengthens the week that contains the fall-back DST change', () => {
    const range = getIsoWeekRange({ year: 2026, week: 43 })
    expect(range.start.toISOString()).toBe('2026-10-18T22:00:00.000Z')
    expect(range.end.toISOString()).toBe('2026-10-25T23:00:00.000Z')
    expect(range.end.getTime() - range.start.getTime()).toBe(7 * 24 * HOUR_MS + HOUR_MS)
    expect(getIsoWeekRange({ year: 2026, week: 44 }).start.toISOString()).toBe('2026-10-25T23:00:00.000Z')
  })

  it('crosses the year boundary for week 1 and week 53', () => {
    const first = getIsoWeekRange({ year: 2026, week: 1 })
    expect(first.start.toISOString()).toBe('2025-12-28T23:00:00.000Z')
    expect(first.end.toISOString()).toBe('2026-01-04T23:00:00.000Z')
    expect(first.dayKeys[0]).toBe('2025-12-29')
    expect(first.dayKeys[6]).toBe('2026-01-04')

    const last2026 = getIsoWeekRange({ year: 2026, week: 53 })
    expect(last2026.start.toISOString()).toBe('2026-12-27T23:00:00.000Z')
    expect(last2026.end.toISOString()).toBe('2027-01-03T23:00:00.000Z')
    expect(last2026.dayKeys).toEqual([
      '2026-12-28',
      '2026-12-29',
      '2026-12-30',
      '2026-12-31',
      '2027-01-01',
      '2027-01-02',
      '2027-01-03',
    ])

    const last2020 = getIsoWeekRange({ year: 2020, week: 53 })
    expect(last2020.start.toISOString()).toBe('2020-12-27T23:00:00.000Z')
    expect(last2020.dayKeys[0]).toBe('2020-12-28')
    expect(last2020.dayKeys[6]).toBe('2021-01-03')
  })
})

describe('zonedMidnight', () => {
  it('follows the Europe/Berlin offset on either side of both DST transitions', () => {
    expect(zonedMidnight(2026, 3, 29).toISOString()).toBe('2026-03-28T23:00:00.000Z')
    expect(zonedMidnight(2026, 3, 30).toISOString()).toBe('2026-03-29T22:00:00.000Z')
    expect(zonedMidnight(2026, 10, 25).toISOString()).toBe('2026-10-24T22:00:00.000Z')
    expect(zonedMidnight(2026, 10, 26).toISOString()).toBe('2026-10-25T23:00:00.000Z')
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
    expect(shiftIsoWeek({ year: 2020, week: 53 }, 1)).toEqual({ year: 2021, week: 1 })
  })
})
