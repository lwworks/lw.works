'use client'

import { Button } from '@lw/ui/components/button'
import { cn } from '@lw/ui/lib/utils'
import { useState } from 'react'

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' }

// Google Calendar descriptions are HTML; render them as plain text.
const toPlainText = (html: string) =>
  html
    .replace(/<br\s*\/?>|<\/(p|div|li|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(\w+|#39);/g, (match, name: string) => ENTITIES[name] ?? match)
    .replace(/\n{3,}/g, '\n\n')
    .trim()

export const EntryDescription = ({ description }: { description: string }) => {
  const [expanded, setExpanded] = useState(false)
  const text = toPlainText(description)
  if (!text) return null
  const long = text.length > 180 || text.split('\n').length > 3

  return (
    <div className="mt-1 flex flex-col items-start gap-0.5">
      <p className={cn('text-xs whitespace-pre-wrap', long && !expanded && 'line-clamp-3')}>{text}</p>
      {long ? (
        <Button type="button" variant="link" size="xs" className="h-auto px-0" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Weniger' : 'Mehr anzeigen'}
        </Button>
      ) : null}
    </div>
  )
}
