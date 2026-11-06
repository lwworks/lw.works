import { describe, expect, it } from 'vitest'
import { parseTagInput } from '@/lib/tags/parse-tag-input'

describe('parseTagInput', () => {
  it('accepts a name and a #RRGGBB color', () => {
    const form = new FormData()
    form.set('name', 'BNI')
    form.set('color', '#ef4444')
    expect(parseTagInput(form)).toEqual({ ok: true, value: { name: 'BNI', color: '#EF4444' } })
  })

  it('rejects a color that is not #RRGGBB', () => {
    const form = new FormData()
    form.set('name', 'BNI')
    form.set('color', 'red')
    expect(parseTagInput(form)).toEqual({ ok: false, message: 'Farbe muss #RRGGBB sein.' })
  })
})
