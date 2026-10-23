'use client'

import { htmlToPlainText } from '@/lib/format/html-to-plain-text'
import { Button } from '@lw/ui/components/button'
import { cn } from '@lw/ui/lib/utils'
import { useState } from 'react'

export const EntryDescription = ({ description }: { description: string }) => {
  const [expanded, setExpanded] = useState(false)
  const text = htmlToPlainText(description)
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
