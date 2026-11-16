import { parseRevenueRange } from '@/lib/finance/parse-revenue-range'
import { describe, expect, it } from 'vitest'

describe('parseRevenueRange', () => {
  const parse = (params: Record<string, string>) => parseRevenueRange(params, '2026-11', '2023-01')

  it('defaults to the last 12 months', () => {
    expect(parse({})).toEqual({ preset: '12m', from: '2025-12', to: '2026-11' })
    expect(parse({ zeitraum: 'quatsch' })).toEqual({ preset: '12m', from: '2025-12', to: '2026-11' })
  })

  it('handles the year presets', () => {
    expect(parse({ zeitraum: 'jahr' })).toEqual({ preset: 'jahr', from: '2026-01', to: '2026-12' })
    expect(parse({ zeitraum: 'vorjahr' })).toEqual({ preset: 'vorjahr', from: '2025-01', to: '2025-12' })
  })

  it('starts "alles" at the first invoice', () => {
    expect(parse({ zeitraum: 'alles' })).toEqual({ preset: 'alles', from: '2023-01', to: '2026-11' })
    expect(parseRevenueRange({ zeitraum: 'alles' }, '2026-11', null)).toEqual({ preset: 'alles', from: '2026-11', to: '2026-11' })
  })

  it('accepts a custom range and swaps reversed months', () => {
    expect(parse({ zeitraum: 'frei', von: '2024-03', bis: '2024-08' })).toEqual({ preset: 'frei', from: '2024-03', to: '2024-08' })
    expect(parse({ zeitraum: 'frei', von: '2024-08', bis: '2024-03' })).toEqual({ preset: 'frei', from: '2024-03', to: '2024-08' })
  })

  it('falls back to 12 months for an invalid custom range', () => {
    expect(parse({ zeitraum: 'frei', von: '2024-13', bis: '2024-03' }).preset).toBe('12m')
  })
})
