import { describe, expect, it } from 'vitest'
import { slugify } from '@/lib/projects/slugify'

describe('slugify', () => {
  it.each([
    ['Website Relaunch', 'website-relaunch'],
    ['Größenänderung für Bücher', 'groessenaenderung-fuer-buecher'],
    ['  Café & Crème — 2026! ', 'cafe-creme-2026'],
    ['Straße', 'strasse'],
    ['???', 'projekt'],
  ])('%j → %j', (title, slug) => {
    expect(slugify(title)).toBe(slug)
  })

  it('caps the length without a trailing dash', () => {
    const slug = slugify(`${'a'.repeat(79)} b`)
    expect(slug.length).toBeLessThanOrEqual(80)
    expect(slug.endsWith('-')).toBe(false)
  })
})
