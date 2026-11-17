import { describe, expect, it } from 'vitest'
import { parseNoteDoc } from '@/lib/notes/parse-note-doc'

const paragraph = (text: string, marks?: unknown[]) => ({ type: 'paragraph', content: [{ type: 'text', text, ...(marks ? { marks } : {}) }] })

describe('parseNoteDoc', () => {
  it('keeps paragraphs, lists, bold, italic and links, and drops extra attributes', () => {
    const result = parseNoteDoc({
      type: 'doc',
      content: [
        paragraph('Wichtig', [{ type: 'bold' }, { type: 'italic' }]),
        paragraph('Website', [{ type: 'link', attrs: { href: 'https://lw.works', target: '_blank', class: 'x' } }]),
        { type: 'orderedList', attrs: { start: 3, type: null }, content: [{ type: 'listItem', content: [paragraph('Drei')] }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [paragraph('Punkt'), { type: 'bulletList', content: [{ type: 'listItem', content: [paragraph('Unterpunkt')] }] }] }] },
      ],
    })
    expect(result).toEqual({
      ok: true,
      value: {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Wichtig', marks: [{ type: 'bold' }, { type: 'italic' }] }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Website', marks: [{ type: 'link', attrs: { href: 'https://lw.works/' } }] }] },
          { type: 'orderedList', attrs: { start: 3 }, content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Drei' }] }] }] },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  { type: 'paragraph', content: [{ type: 'text', text: 'Punkt' }] },
                  { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Unterpunkt' }] }] }] },
                ],
              },
            ],
          },
        ],
      },
    })
  })

  it('drops unknown nodes, unknown marks and unsafe links', () => {
    const result = parseNoteDoc({
      type: 'doc',
      content: [
        { type: 'heading', content: [{ type: 'text', text: 'Weg' }] },
        { type: 'codeBlock', content: [{ type: 'text', text: 'Weg' }] },
        paragraph('Klick', [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }, { type: 'strike' }]),
      ],
    })
    expect(result).toEqual({ ok: true, value: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Klick' }] }] } })
  })

  it('trims trailing empty paragraphs and rejects empty notes', () => {
    const result = parseNoteDoc({ type: 'doc', content: [paragraph('Text'), { type: 'paragraph' }, { type: 'paragraph' }] })
    expect(result.ok && result.value.content).toHaveLength(1)
    expect(parseNoteDoc({ type: 'doc', content: [{ type: 'paragraph' }, paragraph('   ')] })).toEqual({ ok: false, message: 'Die Notiz ist leer.' })
    expect(parseNoteDoc('<p>hi</p>')).toEqual({ ok: false, message: 'Die Notiz ist ungültig.' })
  })
})
