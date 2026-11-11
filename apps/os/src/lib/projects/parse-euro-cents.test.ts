import { describe, expect, it } from 'vitest'
import { parseEuroCents } from '@/lib/projects/parse-euro-cents'

describe('parseEuroCents', () => {
  it.each([
    ['95', 9500],
    ['95,5', 9550],
    ['1.234,56', 123456],
    ['12.000 €', 1200000],
  ])('%j → %d', (input, cents) => {
    expect(parseEuroCents(input)).toBe(cents)
  })

  it.each(['', 'abc', '-5', '9,999'])('rejects %j', (input) => {
    expect(parseEuroCents(input)).toBeNull()
  })
})
