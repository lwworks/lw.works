import type { NoteBlock, NoteDoc, NoteInline } from "@/lib/notes/note-doc"
import { safeNoteHref } from "@/lib/notes/safe-note-href"
import { cn } from "@lw/ui/lib/utils"
import type { ReactNode } from "react"

/** Shared typography for rendered notes and the editor, so a note looks the same while writing and reading. */
export const noteProseClassName = cn(
  "prose prose-sm prose-neutral max-w-none dark:prose-invert",
  "prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-li:marker:text-neutral-400",
  "prose-a:font-medium prose-a:underline-offset-2",
)

/** Renders a stored note as React elements (never as HTML); links are checked again before rendering. */
export const NoteContent = ({ doc, className }: { doc: NoteDoc; className?: string }) => (
  <div className={cn(noteProseClassName, className)}>{doc.content.map(renderBlock)}</div>
)

const renderBlock = (block: NoteBlock, index: number): ReactNode => {
  switch (block.type) {
    case "paragraph":
      return <p key={index}>{(block.content ?? []).map(renderInline)}</p>
    case "bulletList":
      return (
        <ul key={index}>
          {block.content.map((item, itemIndex) => (
            <li key={itemIndex}>{item.content.map(renderBlock)}</li>
          ))}
        </ul>
      )
    case "orderedList":
      return (
        <ol key={index} start={block.attrs?.start}>
          {block.content.map((item, itemIndex) => (
            <li key={itemIndex}>{item.content.map(renderBlock)}</li>
          ))}
        </ol>
      )
  }
}

const renderInline = (inline: NoteInline, index: number): ReactNode => {
  if (inline.type === "hardBreak") return <br key={index} />
  let node: ReactNode = inline.text
  for (const mark of inline.marks ?? []) {
    if (mark.type === "bold") node = <strong>{node}</strong>
    if (mark.type === "italic") node = <em>{node}</em>
    if (mark.type === "link") {
      const href = safeNoteHref(mark.attrs.href)
      if (href) node = <a href={href} target="_blank" rel="noopener noreferrer nofollow">{node}</a>
    }
  }
  return <span key={index}>{node}</span>
}
