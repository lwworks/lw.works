import { describe, expect, it } from 'vitest'
import { safeNoteHref } from '@/lib/notes/safe-note-href'

describe('safeNoteHref', () => {
  it('keeps http(s), mailto and tel links', () => {
    expect(safeNoteHref('https://lw.works/kontakt')).toBe('https://lw.works/kontakt')
    expect(safeNoteHref('mailto:hallo@example.com')).toBe('mailto:hallo@example.com')
    expect(safeNoteHref('tel:+4930123')).toBe('tel:+4930123')
  })

  it('adds https to a bare domain', () => {
    expect(safeNoteHref('  lw.works/projekte ')).toBe('https://lw.works/projekte')
  })

  it('rejects scripts, data urls and relative paths', () => {
    expect(safeNoteHref('javascript:alert(1)')).toBeNull()
    expect(safeNoteHref('JaVaScRiPt:alert(1)')).toBeNull()
    expect(safeNoteHref('data:text/html,<script>')).toBeNull()
    expect(safeNoteHref('/kontakte')).toBeNull()
    expect(safeNoteHref('')).toBeNull()
  })
})
