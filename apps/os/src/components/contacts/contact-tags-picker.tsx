"use client"

import { addNewTagToContactAction, setContactTagsAction } from "@/app/kontakte/actions"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { tagSwatchColor } from "@/lib/tags/tag-swatch-color"
import { Button } from "@lw/ui/components/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@lw/ui/components/command"
import { Popover, PopoverContent, PopoverTrigger } from "@lw/ui/components/popover"
import { toast } from "@lw/ui/components/sonner"
import { cn } from "@lw/ui/lib/utils"
import { Plus, Tag } from "@mynaui/icons-react"
import { useOptimistic, useState, useTransition } from "react"

/** The contact's tags as chips, plus a searchable picker that toggles tags (and creates a missing one) right away. */
export const ContactTagsPicker = ({ displayId, tags, selectedIds }: { displayId: number; tags: TagListItem[]; selectedIds: string[] }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [pending, startTransition] = useTransition()
  const [optimisticIds, setOptimisticIds] = useOptimistic(selectedIds)
  const selected = new Set(optimisticIds)
  const query = search.trim()
  const exactMatch = tags.some((tag) => tag.name.toLowerCase() === query.toLowerCase())

  const toggle = (id: string) => {
    const next = selected.has(id) ? optimisticIds.filter((tagId) => tagId !== id) : [...optimisticIds, id]
    startTransition(async () => {
      setOptimisticIds(next)
      const result = await setContactTagsAction(displayId, next)
      if (!result.ok) toast.error(result.message)
    })
  }

  const create = () => {
    setSearch("")
    startTransition(async () => {
      const result = await addNewTagToContactAction(displayId, query)
      if (!result.ok) toast.error(result.message)
    })
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5")}>
      {tags
        .filter((tag) => selected.has(tag.id))
        .map((tag) => (
          <button
            key={tag.id}
            type="button"
            title="Tag entfernen"
            onClick={() => toggle(tag.id)}
            className={cn("flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-sm text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900")}
          >
            <span className={cn("size-2 rounded-full")} style={{ backgroundColor: tagSwatchColor(tag.color) }} />
            <span>{tag.name}</span>
          </button>
        ))}
      <Popover open={open} onOpenChange={(next) => { setOpen(next); if (!next) setSearch("") }}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className={cn("h-7 rounded-full px-2.5")} disabled={pending && !open}>
            <Tag strokeWidth={1.5} className={cn("size-4")} />
            <span>{selected.size === 0 ? "Tag hinzufügen" : "Tags"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className={cn("w-64 p-0")}>
          <Command>
            <CommandInput placeholder="Tags suchen …" value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty className={cn(query && "hidden")}>Noch keine Tags.</CommandEmpty>
              {tags.length > 0 ? (
                <CommandGroup>
                  {tags.map((tag) => (
                    <CommandItem key={tag.id} value={`${tag.name} ${tag.id}`} data-checked={selected.has(tag.id)} onSelect={() => toggle(tag.id)}>
                      <span className={cn("size-2 rounded-full")} style={{ backgroundColor: tagSwatchColor(tag.color) }} />
                      <span className={cn("truncate")}>{tag.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {query && !exactMatch ? (
                <CommandGroup forceMount>
                  <CommandItem value={`__create__ ${query}`} forceMount onSelect={create}>
                    <Plus strokeWidth={1.5} />
                    <span className={cn("truncate")}>Neuer Tag „{query}“</span>
                  </CommandItem>
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
