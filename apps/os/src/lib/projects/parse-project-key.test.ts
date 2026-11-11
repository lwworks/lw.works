import { describe, expect, it } from 'vitest'
import { parseProjectKey } from '@/lib/projects/parse-project-key'

describe('parseProjectKey', () => {
  it.each([
    ['BR: Abstimmung Relaunch', { key: 'BR', rest: 'Abstimmung Relaunch' }],
    ['BR:Abstimmung', { key: 'BR', rest: 'Abstimmung' }],
    ['  LW2:  Planung ', { key: 'LW2', rest: 'Planung' }],
    ['BR:', { key: 'BR', rest: '' }],
    ['BR: Teil 1: Konzept', { key: 'BR', rest: 'Teil 1: Konzept' }],
  ])('reads %j', (title, expected) => {
    expect(parseProjectKey(title)).toEqual(expected)
  })

  it.each(['BR Abstimmung', '[BR] Abstimmung', 'br: Abstimmung', 'Br: Abstimmung', 'B: Abstimmung', 'TOOLONG: x', '2B: x', 'Abstimmung BR: x', 'BR : x'])(
    'ignores %j',
    (title) => {
      expect(parseProjectKey(title)).toBeNull()
    },
  )
})
