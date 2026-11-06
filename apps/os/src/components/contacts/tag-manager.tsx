"use client"

import { createTagAction, removeTagAction } from "@/app/kontakte/actions"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { tagSwatchColor } from "@/lib/tags/tag-swatch-color"
import { Button } from "@lw/ui/components/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@lw/ui/components/dialog"
import { Input } from "@lw/ui/components/input"
import { Label } from "@lw/ui/components/label"
import { toast } from "@lw/ui/components/sonner"
import { Tag, Trash } from "@mynaui/icons-react"
import { useActionState, useTransition } from "react"

export const TagManager = ({ tags }: { tags: TagListItem[] }) => {
  const [state, formAction, pending] = useActionState(createTagAction, null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Tag strokeWidth={1.5} className="size-4" />
          <span>Tags</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tags</DialogTitle>
        </DialogHeader>
        <ul className="flex flex-col gap-2">
          {tags.length === 0 ? <li className="text-sm">Noch keine Tags.</li> : null}
          {tags.map((tag) => (
            <li key={tag.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: tagSwatchColor(tag.color) }} />
                <span>{tag.name}</span>
              </span>
              <DeleteTagButton id={tag.id} />
            </li>
          ))}
        </ul>
        <form action={formAction} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tag-name">Name</Label>
            <Input id="tag-name" name="name" required maxLength={40} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tag-color">Farbe</Label>
            <Input id="tag-color" name="color" type="color" defaultValue="#737373" className="h-8 w-16 p-1" />
          </div>
          {state ? <p className="text-sm text-destructive">{state.message}</p> : null}
          <DialogFooter>
            <Button type="submit" disabled={pending}>{pending ? "Speichert …" : "Tag anlegen"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const DeleteTagButton = ({ id }: { id: string }) => {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={pending}
      aria-label="Tag löschen"
      onClick={() => {
        if (!confirm("Tag löschen? Er wird von allen Kontakten entfernt.")) return
        startTransition(async () => {
          const result = await removeTagAction(id)
          if (!result.ok) toast.error(result.message)
        })
      }}
    >
      <Trash strokeWidth={1.5} className="size-4" />
    </Button>
  )
}
