import { describe, expect, it } from 'vitest'
import { buildActivityGrid } from '@/lib/time-tracking/build-activity-grid'

describe('buildActivityGrid', () => {
  it('lays out ISO week columns from Monday to Sunday and leaves days outside the range empty', () => {
    // 2026-01-01 is a Thursday in ISO week 2026-W01 (Monday 2025-12-29).
    const grid = buildActivityGrid({ from: '2026-01-01', to: '2026-01-13', trackedMs: new Map([['2026-01-02', 3 * 60 * 60 * 1000]]) })

    expect(grid.weeks.map(({ week }) => week)).toEqual([
      { year: 2026, week: 1 },
      { year: 2026, week: 2 },
      { year: 2026, week: 3 },
    ])
    expect(grid.weeks[0].days.map((day) => day?.date ?? null)).toEqual([null, null, null, '2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04'])
    expect(grid.weeks[0].days[4]).toEqual({ date: '2026-01-02', ms: 3 * 60 * 60 * 1000, level: 2 })
    expect(grid.weeks[0].days[3]).toEqual({ date: '2026-01-01', ms: 0, level: 0 })
    expect(grid.weeks[2].days.map((day) => day?.date ?? null)).toEqual(['2026-01-12', '2026-01-13', null, null, null, null, null])
  })

  it('labels each month at the column of its first shown day', () => {
    const grid = buildActivityGrid({ from: '2026-01-01', to: '2026-03-02', trackedMs: new Map() })

    expect(grid.months).toEqual([
      { label: 'Jan', column: 0 },
      { label: 'Feb', column: 4 },
      { label: 'Mär', column: 8 },
    ])
    expect(grid.weeks[4].days[6]?.date).toBe('2026-02-01')
    expect(grid.weeks.at(-1)?.days[0]?.date).toBe('2026-03-02')
  })

  it('includes days after today through the end of the range', () => {
    const grid = buildActivityGrid({ from: '2026-01-01', to: '2026-12-31', today: '2026-10-30', trackedMs: new Map() })
    const dates = grid.weeks.flatMap((week) => week.days.map((day) => day?.date))

    expect(grid.today).toBe('2026-10-30')
    expect(grid.to).toBe('2026-12-31')
    expect(dates).toContain('2026-10-30')
    expect(dates).toContain('2026-12-31')
    expect(dates).not.toContain('2027-01-01')
  })

  it('spans DST changes with exactly seven days per week', () => {
    const grid = buildActivityGrid({ from: '2026-03-23', to: '2026-04-05', trackedMs: new Map() })

    expect(grid.weeks.map((week) => week.days.map((day) => day?.date))).toEqual([
      ['2026-03-23', '2026-03-24', '2026-03-25', '2026-03-26', '2026-03-27', '2026-03-28', '2026-03-29'],
      ['2026-03-30', '2026-03-31', '2026-04-01', '2026-04-02', '2026-04-03', '2026-04-04', '2026-04-05'],
    ])
  })
})
