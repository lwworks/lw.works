"use client"

import { noteProseClassName } from "@/components/notes/note-content"
import type { NoteDoc } from "@/lib/notes/note-doc"
import { safeNoteHref } from "@/lib/notes/safe-note-href"
import { Button } from "@lw/ui/components/button"
import { Input } from "@lw/ui/components/input"
import { Popover, PopoverContent, PopoverTrigger } from "@lw/ui/components/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@lw/ui/components/tooltip"
import { cn } from "@lw/ui/lib/utils"
import { Link as LinkIcon, List, ListNumber, TypeBold, TypeItalic } from "@mynaui/icons-react"
import { Placeholder } from "@tiptap/extensions"
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react"

const subscribeNoop = () => () => {}

/** ⌘ on Apple devices, Strg elsewhere; Strg on the server, so hydration stays stable. */
const useModifierKey = () =>
  useSyncExternalStore(subscribeNoop, () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Strg"), () => "Strg")

/**
 * Rich-text editor for notes: bold, italic, bullet and numbered lists, links. Everything else from Tiptap's
 * StarterKit is switched off, matching what `parseNoteDoc` keeps. ⌘/Ctrl+Enter submits, Escape cancels.
 * `onSubmit` returns true when saved; a composer (no `initialContent`) then clears itself.
 * `variant="bare"` drops the frame, for a composer that spans a full page section.
 */
export const NoteEditor = ({
  initialContent,
  placeholder = "Notiz schreiben …",
  submitLabel,
  pending,
  autoFocus = false,
  onSubmit,
  onCancel,
  variant = "boxed",
}: {
  variant?: "boxed" | "bare"
  initialContent?: NoteDoc
  placeholder?: string
  submitLabel: string
  pending: boolean
  autoFocus?: boolean
  onSubmit: (doc: NoteDoc) => Promise<boolean>
  onCancel?: () => void
}) => {
  // Keyboard handlers are bound once by Tiptap, so they read the latest callbacks from a ref.
  const submitRef = useRef<() => void>(() => {})
  const cancelRef = useRef(onCancel)
  const modifierKey = useModifierKey()

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: autoFocus ? "end" : false,
    content: initialContent,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        strike: false,
        underline: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
          defaultProtocol: "https",
          protocols: ["mailto", "tel"],
          isAllowedUri: (url) => safeNoteHref(url) !== null,
          HTMLAttributes: { target: "_blank", rel: "noopener noreferrer nofollow" },
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    editorProps: {
      attributes: {
        class: cn(noteProseClassName, "outline-none", variant === "bare" ? "min-h-16 py-1" : "min-h-12 px-3 py-2"),
        "aria-label": placeholder,
      },
      handleKeyDown: (_view, event) => {
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault()
          submitRef.current()
          return true
        }
        if (event.key === "Escape" && cancelRef.current) {
          cancelRef.current()
          return true
        }
        return false
      },
    },
  })

  const isEmpty = useEditorState({ editor, selector: ({ editor }) => editor?.isEmpty ?? true }) ?? true

  const submit = async () => {
    if (!editor || pending || editor.isEmpty) return
    const saved = await onSubmit(editor.getJSON() as NoteDoc)
    if (saved && !initialContent) editor.commands.clearContent(true)
  }
  useLayoutEffect(() => {
    submitRef.current = () => void submit()
    cancelRef.current = onCancel
  })

  return (
    <div
      className={cn(
        variant === "boxed" &&
          "rounded-lg border border-neutral-200 bg-white transition-colors focus-within:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-within:border-neutral-600",
        "[&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-neutral-400 [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
      )}
    >
      <EditorContent editor={editor} />
      <div className={cn("flex items-center justify-between gap-2", variant === "bare" ? "pt-2" : "px-2 pb-2")}>
        {editor ? <Toolbar editor={editor} modifierKey={modifierKey} /> : <div className="h-7" />}
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-neutral-400 sm:inline">{modifierKey} + Enter</span>
          {onCancel ? (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={pending}>
              Abbrechen
            </Button>
          ) : null}
          <Button type="button" size="sm" onClick={() => void submit()} disabled={pending || isEmpty}>
            {pending ? "Speichert …" : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

const Toolbar = ({ editor, modifierKey }: { editor: Editor; modifierKey: string }) => {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      link: editor.isActive("link"),
    }),
  })
  const mod = modifierKey === "⌘" ? "⌘" : "Strg+"

  return (
    <TooltipProvider>
    <div className="-ml-1 flex items-center gap-0.5 text-neutral-500">
      <ToolbarButton label={`Fett (${mod}B)`} active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <TypeBold strokeWidth={1.5} />
      </ToolbarButton>
      <ToolbarButton label={`Kursiv (${mod}I)`} active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <TypeItalic strokeWidth={1.5} />
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
      <ToolbarButton label="Liste" active={state.bulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List strokeWidth={1.5} />
      </ToolbarButton>
      <ToolbarButton label="Nummerierte Liste" active={state.orderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListNumber strokeWidth={1.5} />
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
      <LinkButton editor={editor} active={state.link} />
    </div>
    </TooltipProvider>
  )
}

const ToolbarButton = ({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active: boolean
  onClick?: () => void
  children: ReactNode
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={label}
        aria-pressed={active}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        className={cn(active && "bg-muted text-foreground")}
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)

/** Sets, changes or removes the link on the selection; with nothing selected, inserts the URL as linked text. */
const LinkButton = ({ editor, active }: { editor: Editor; active: boolean }) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const apply = () => {
    if (!value.trim()) return remove()
    const href = safeNoteHref(value)
    if (!href) return setError("Bitte eine gültige Adresse eingeben (https://, mailto: oder tel:).")
    const chain = editor.chain().focus().extendMarkRange("link")
    if (editor.state.selection.empty && !editor.isActive("link")) {
      chain.insertContent({ type: "text", text: value.trim(), marks: [{ type: "link", attrs: { href } }] }).run()
    } else {
      chain.setLink({ href }).run()
    }
    setOpen(false)
  }

  const remove = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setValue((editor.getAttributes("link").href as string | undefined) ?? "")
          setError(null)
        }
        setOpen(next)
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Link"
              aria-pressed={active}
              onMouseDown={(event) => event.preventDefault()}
              className={cn(active && "bg-muted text-foreground")}
            >
              <LinkIcon strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Link</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-80">
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            apply()
          }}
        >
          <Input
            autoFocus
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setError(null)
            }}
            placeholder="https://…"
            aria-label="Link-Adresse"
            aria-invalid={error ? true : undefined}
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <div className="flex justify-end gap-2">
            {active ? (
              <Button type="button" variant="ghost" size="sm" onClick={remove}>
                Entfernen
              </Button>
            ) : null}
            <Button type="submit" size="sm">
              Übernehmen
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
