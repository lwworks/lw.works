import type { NoteBlock, NoteDoc, NoteInline, NoteListItem, NoteMark } from '@/lib/notes/note-doc'
import { safeNoteHref } from '@/lib/notes/safe-note-href'

const MAX_JSON_LENGTH = 100_000
const MAX_DEPTH = 8

type ParseResult = { ok: true; value: NoteDoc } | { ok: false; message: string }

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

const children = (node: Record<string, unknown>) => (Array.isArray(node.content) ? node.content : [])

const parseMarks = (raw: unknown): NoteMark[] => {
  if (!Array.isArray(raw)) return []
  const marks: NoteMark[] = []
  for (const mark of raw) {
    if (!isRecord(mark)) continue
    if ((mark.type === 'bold' || mark.type === 'italic') && !marks.some((m) => m.type === mark.type)) marks.push({ type: mark.type })
    if (mark.type === 'link' && isRecord(mark.attrs) && typeof mark.attrs.href === 'string' && !marks.some((m) => m.type === 'link')) {
      const href = safeNoteHref(mark.attrs.href)
      if (href) marks.push({ type: 'link', attrs: { href } })
    }
  }
  return marks
}

const parseInlines = (raw: unknown[]): NoteInline[] => {
  const inlines: NoteInline[] = []
  for (const node of raw) {
    if (!isRecord(node)) continue
    if (node.type === 'hardBreak') inlines.push({ type: 'hardBreak' })
    if (node.type === 'text' && typeof node.text === 'string' && node.text.length > 0) {
      const marks = parseMarks(node.marks)
      inlines.push(marks.length > 0 ? { type: 'text', text: node.text, marks } : { type: 'text', text: node.text })
    }
  }
  return inlines
}

const parseListItems = (raw: unknown[], depth: number): NoteListItem[] =>
  raw.flatMap((node) => {
    if (!isRecord(node) || node.type !== 'listItem') return []
    const content = parseBlocks(children(node), depth + 1)
    return [{ type: 'listItem' as const, content: content.length > 0 ? content : [{ type: 'paragraph' as const }] }]
  })

const parseBlocks = (raw: unknown[], depth: number): NoteBlock[] => {
  if (depth > MAX_DEPTH) return []
  const blocks: NoteBlock[] = []
  for (const node of raw) {
    if (!isRecord(node)) continue
    if (node.type === 'paragraph') {
      const content = parseInlines(children(node))
      blocks.push(content.length > 0 ? { type: 'paragraph', content } : { type: 'paragraph' })
    }
    if (node.type === 'bulletList' || node.type === 'orderedList') {
      const items = parseListItems(children(node), depth)
      if (items.length === 0) continue
      if (node.type === 'bulletList') {
        blocks.push({ type: 'bulletList', content: items })
        continue
      }
      const start = isRecord(node.attrs) && Number.isInteger(node.attrs.start) ? (node.attrs.start as number) : 1
      blocks.push(start !== 1 && start > 0 ? { type: 'orderedList', attrs: { start }, content: items } : { type: 'orderedList', content: items })
    }
  }
  return blocks
}

const hasText = (blocks: NoteBlock[]): boolean =>
  blocks.some((block) =>
    block.type === 'paragraph'
      ? (block.content ?? []).some((inline) => inline.type === 'text' && inline.text.trim().length > 0)
      : block.content.some((item) => hasText(item.content)),
  )

/** Strips trailing empty paragraphs, which the editor leaves behind after pressing Enter. */
const trimTrailingEmpty = (blocks: NoteBlock[]) => {
  const result = [...blocks]
  while (result.length > 0) {
    const last = result[result.length - 1]
    if (last?.type !== 'paragraph' || (last.content ?? []).some((inline) => inline.type === 'text' && inline.text.trim())) break
    result.pop()
  }
  return result
}

/**
 * Validates an editor document from the client and rebuilds it from the allowed nodes and marks only, so stored
 * notes never carry unknown nodes, attributes or unsafe links. Rejects empty notes.
 */
export const parseNoteDoc = (raw: unknown): ParseResult => {
  if (!isRecord(raw) || raw.type !== 'doc') return { ok: false, message: 'Die Notiz ist ungültig.' }
  if (JSON.stringify(raw).length > MAX_JSON_LENGTH) return { ok: false, message: 'Die Notiz ist zu lang.' }
  const content = trimTrailingEmpty(parseBlocks(children(raw), 0))
  if (!hasText(content)) return { ok: false, message: 'Die Notiz ist leer.' }
  return { ok: true, value: { type: 'doc', content } }
}
