'use client'

import { Button } from '@lw/ui/components/button'
import { useState } from 'react'

const PREVIEW_LENGTH = 180

const namedEntities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
}

const decodeEntity = (body: string) => {
  if (body.startsWith('#')) {
    const code = body[1] === 'x' || body[1] === 'X' ? Number.parseInt(body.slice(2), 16) : Number.parseInt(body.slice(1), 10)
    if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return `&${body};`
    return String.fromCodePoint(code)
  }
  return namedEntities[body.toLowerCase()] ?? `&${body};`
}

const toPlainDescription = (value: string) => value
  .replace(/<\s*br\s*\/?\s*>/gi, '\n')
  .replace(/<\s*\/\s*(?:p|div|h[1-6]|li|tr)\s*>/gi, '\n')
  .replace(/<\s*li[^>]*>/gi, '\n• ')
  .replace(/<[^>]+>/g, '')
  .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, body: string) => decodeEntity(body))
  .replace(/[ \t]+\n/g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim()

const previewText = (text: string) => {
  const cut = text.slice(0, PREVIEW_LENGTH)
  const boundary = cut.lastIndexOf(' ')
  const preview = boundary > 120 ? cut.slice(0, boundary) : cut
  return `${preview.trimEnd()}…`
}

export const EntryDescription = ({ description }: { description: string | null }) => {
  const text = description ? toPlainDescription(description) : ''
  const [expanded, setExpanded] = useState(false)
  if (!text) return null

  const long = text.length > PREVIEW_LENGTH

  return (
    <div className="mt-1 flex flex-col items-start gap-0.5">
      <p className="text-xs whitespace-pre-wrap">{long && !expanded ? previewText(text) : text}</p>
      {long ? (
        <Button
          type="button"
          variant="link"
          size="xs"
          className="h-auto px-0"
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? 'Weniger' : 'Mehr anzeigen'}
        </Button>
      ) : null}
    </div>
  )
}
