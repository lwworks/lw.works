/**
 * The subset of Tiptap's JSON document that notes allow: paragraphs (with hard breaks), bullet and numbered lists
 * (nestable), and bold, italic and link marks. Anything else is dropped by `parseNoteDoc`.
 */
export type NoteMark = { type: 'bold' } | { type: 'italic' } | { type: 'link'; attrs: { href: string } }

export type NoteInline = { type: 'text'; text: string; marks?: NoteMark[] } | { type: 'hardBreak' }

export type NoteParagraph = { type: 'paragraph'; content?: NoteInline[] }

export type NoteListItem = { type: 'listItem'; content: NoteBlock[] }

export type NoteBulletList = { type: 'bulletList'; content: NoteListItem[] }

export type NoteOrderedList = { type: 'orderedList'; attrs?: { start: number }; content: NoteListItem[] }

export type NoteBlock = NoteParagraph | NoteBulletList | NoteOrderedList

export type NoteDoc = { type: 'doc'; content: NoteBlock[] }
