import { describe, expect, it } from 'vitest'
import { getActivityLevel } from '@/lib/time-tracking/get-activity-level'

const hours = (value: number) => value * 60 * 60 * 1000

describe('getActivityLevel', () => {
  it('buckets tracked hours into five levels with inclusive upper bounds', () => {
    expect(getActivityLevel(0)).toBe(0)
    expect(getActivityLevel(-1)).toBe(0)
    expect(getActivityLevel(1)).toBe(1)
    expect(getActivityLevel(hours(2))).toBe(1)
    expect(getActivityLevel(hours(2) + 1)).toBe(2)
    expect(getActivityLevel(hours(4))).toBe(2)
    expect(getActivityLevel(hours(5))).toBe(3)
    expect(getActivityLevel(hours(6))).toBe(3)
    expect(getActivityLevel(hours(6) + 1)).toBe(4)
    expect(getActivityLevel(hours(12))).toBe(4)
  })
})
