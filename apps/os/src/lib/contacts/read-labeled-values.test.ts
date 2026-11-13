import { describe, expect, it } from 'vitest'
import { readLabeledValues } from '@/lib/contacts/read-labeled-values'

describe('readLabeledValues', () => {
  it('reads values and types by position, dropping empty rows and duplicates', () => {
    const form = new FormData()
    for (const [value, type] of [
      ['+49 171 1', 'mobile'],
      ['', 'work'],
      ['+49 421 2', 'none'],
      ['+49171 1', 'home'],
      [' +49 30 3 ', 'Büro'],
    ]) {
      form.append('phoneValue', value!)
      form.append('phoneType', type!)
    }
    expect(readLabeledValues(form, 'phone', 40)).toEqual([
      { value: '+49 171 1', type: 'mobile' },
      { value: '+49 421 2', type: null },
      { value: '+49 30 3', type: 'Büro' },
    ])
  })

  it('treats addresses that differ only in case as the same', () => {
    const form = new FormData()
    form.append('emailValue', 'Ada@lw.works')
    form.append('emailValue', 'ada@lw.works')
    expect(readLabeledValues(form, 'email', 320)).toEqual([{ value: 'Ada@lw.works', type: null }])
  })
})
