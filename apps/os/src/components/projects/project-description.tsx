"use client"

import { saveProjectDescriptionAction } from "@/app/projekte/actions"
import { noteProseClassName, NoteContent } from "@/components/notes/note-content"
import { editorPlaceholderClassName, noteExtensions, NoteToolbar, useModifierKey } from "@/components/notes/note-editor"
import type { NoteDoc } from "@/lib/notes/note-doc"
import { toast } from "@lw/ui/components/sonner"
import { cn } from "@lw/ui/lib/utils"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import { useEffect, useRef, useState } from "react"

/** Pause in typing after which the description is saved. */
const SAVE_DELAY_MS = 800

type SaveState = "idle" | "saving" | "saved" | "error"

/**
 * The project description, edited in place like in Linear: always an editor, no edit mode or save button. Changes
 * save after a short pause in typing and when the editor loses focus; the toolbar shows while hovering or editing.
 * Archived projects show the description read-only.
 */
export const ProjectDescription = ({ projectId, initial, readOnly }: { projectId: string; initial: NoteDoc | null; readOnly: boolean }) => {
  if (readOnly) {
    return initial ? <NoteContent doc={initial} /> : <p className={cn("text-sm text-neutral-400")}>Keine Beschreibung.</p>
  }
  return <DescriptionEditor projectId={projectId} initial={initial} />
}

/** ProseMirror attrs have no plain prototype, which server actions drop; a JSON round trip fixes that (see NoteEditor). */
const toDoc = (editor: Editor) => (editor.isEmpty ? null : (JSON.parse(JSON.stringify(editor.getJSON())) as NoteDoc))

const DescriptionEditor = ({ projectId, initial }: { projectId: string; initial: NoteDoc | null }) => {
  const modifierKey = useModifierKey()
  const [state, setState] = useState<SaveState>("idle")
  // What the server has, as the editor serializes it; set once the editor exists (`onCreate`).
  const savedJson = useRef("")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Saves run one after another, so an older save never lands after a newer one.
  const queue = useRef<Promise<unknown>>(Promise.resolve())

  const save = (editor: Editor) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    const doc = toDoc(editor)
    const json = JSON.stringify(doc)
    if (json === savedJson.current) return
    savedJson.current = json
    setState("saving")
    queue.current = queue.current.then(async () => {
      const result = await saveProjectDescriptionAction(projectId, doc).catch(() => ({ ok: false as const, message: "Beschreibung konnte nicht gespeichert werden." }))
      if (result.ok) {
        setState("saved")
      } else {
        // Forget what was "saved", so the next change or blur tries again.
        savedJson.current = ""
        setState("error")
        toast.error(result.message)
      }
    })
  }
  const saveRef = useRef(save)
  useEffect(() => {
    saveRef.current = save
  })

  const editor = useEditor({
    immediatelyRender: false,
    content: initial ?? undefined,
    extensions: noteExtensions("Beschreibung hinzufügen …"),
    editorProps: {
      attributes: { class: cn(noteProseClassName, "min-h-12 outline-none"), "aria-label": "Projektbeschreibung" },
    },
    onCreate: ({ editor }) => {
      savedJson.current = JSON.stringify(toDoc(editor))
    },
    onUpdate: ({ editor }) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => saveRef.current(editor), SAVE_DELAY_MS)
    },
    onBlur: ({ editor }) => saveRef.current(editor),
  })

  // Leaving the page (tab switch, navigation) right after typing still saves.
  useEffect(() => {
    if (!editor) return
    const flush = () => {
      if (timer.current) saveRef.current(editor)
    }
    window.addEventListener("pagehide", flush)
    return () => {
      window.removeEventListener("pagehide", flush)
      flush()
    }
  }, [editor])

  return (
    <div className={cn("group", editorPlaceholderClassName)}>
      <EditorContent editor={editor} />
      <div
        className={cn(
          "mt-2 flex items-center justify-between gap-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100",
          state === "error" && "opacity-100",
        )}
      >
        {editor ? <NoteToolbar editor={editor} modifierKey={modifierKey} /> : <div className={cn("h-7")} />}
        <span className={cn("text-xs text-neutral-400", state === "error" && "text-destructive")} aria-live="polite">
          {{ idle: "", saving: "Speichert …", saved: "Gespeichert", error: "Nicht gespeichert" }[state]}
        </span>
      </div>
    </div>
  )
}
