"use client"

import { rankFrequentTags } from "@/lib/tags/rank-frequent-tags"
import { TAG_COLORS } from "@/lib/tags/tag-colors"
import { tagSwatchColor } from "@/lib/tags/tag-swatch-color"
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@lw/ui/components/command"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@lw/ui/components/popover"
import { cn } from "@lw/ui/lib/utils"
import { Check, Plus, Tag } from "@mynaui/icons-react"
import { TagsPill } from "@/components/tags/tags-pill"
import { Command as CommandPrimitive } from "cmdk"
import { useEffect, useRef, useState } from "react"

export type PickerTag = { id: string; name: string; color: string; usageCount: number }

/** Shows more than one group (frequent + the rest) only once there are this many tags. */
const GROUP_THRESHOLD = 7

/**
 * Linear-style tag picker. Without tags the trigger is an "add" pill; with tags, the chips and a plus
 * button open it. Typing a missing name offers to create it, then asks for a color.
 */
export const TagPicker = ({
  tags,
  selectedIds,
  onToggle,
  onCreate,
  shortcut,
  disabled = false,
  variant = "chips",
}: {
  tags: PickerTag[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onCreate: (name: string, color: string) => void
  /** Single key that opens the picker while focus is not in a field. */
  shortcut?: string
  disabled?: boolean
  /** `compact` (tables): a single summary pill as trigger, nothing when no tag is set. */
  variant?: "chips" | "compact"
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [draftName, setDraftName] = useState<string | null>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const selected = new Set(selectedIds)
  const selectedTags = tags.filter((tag) => selected.has(tag.id))

  const changeOpen = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setSearch("")
      setDraftName(null)
    }
  }

  useEffect(() => {
    if (!shortcut || disabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return
      if (event.key.toLowerCase() !== shortcut.toLowerCase()) return
      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return
      if (document.querySelector('[data-slot="dialog-content"], [data-slot="popover-content"]')) return
      event.preventDefault()
      setOpen(true)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [shortcut, disabled])

  const toggle = (id: string) => {
    onToggle(id)
    setSearch("")
  }

  const startCreate = (name: string) => {
    setDraftName(name)
    setSearch("")
  }

  const create = (color: string) => {
    if (draftName === null) return
    onCreate(draftName, color)
    changeOpen(false)
  }

  if (variant === "compact" && selectedTags.length === 0) return null

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverAnchor asChild>
        <div ref={anchorRef} className={cn("flex flex-wrap items-center gap-1.5")}>
          {variant === "compact" ? (
            <PopoverTrigger asChild>
              <TagsPill tags={selectedTags} disabled={disabled} />
            </PopoverTrigger>
          ) : selectedTags.length === 0 ? (
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                className={cn(
                  "flex h-7 items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 text-sm hover:bg-neutral-200 hover:text-black disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
                )}
              >
                <Tag strokeWidth={1.5} className={cn("size-4")} />
                <span>Tag hinzufügen</span>
              </button>
            </PopoverTrigger>
          ) : (
            <>
              {selectedTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setOpen(true)}
                  className={cn(
                    "flex h-7 max-w-full items-center gap-1.5 rounded-full border px-2.5 text-sm text-black hover:bg-neutral-100 disabled:opacity-50 dark:text-white dark:hover:bg-neutral-900"
                  )}
                >
                  <TagDot color={tag.color} />
                  <span className={cn("truncate")}>{tag.name}</span>
                </button>
              ))}
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label="Tags bearbeiten"
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full hover:bg-neutral-100 hover:text-black disabled:opacity-50 dark:hover:bg-neutral-900 dark:hover:text-white"
                  )}
                >
                  <Plus strokeWidth={1.5} className={cn("size-4")} />
                </button>
              </PopoverTrigger>
            </>
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className={cn("w-60 gap-0 overflow-hidden rounded-xl p-0")}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          inputRef.current?.focus()
        }}
        onInteractOutside={(event) => {
          // Clicking a chip while open should keep the picker open instead of closing and reopening it.
          if (event.target instanceof Node && anchorRef.current?.contains(event.target)) event.preventDefault()
        }}
        onEscapeKeyDown={(event) => {
          if (draftName === null) return
          event.preventDefault()
          setSearch(draftName)
          setDraftName(null)
        }}
      >
        {draftName === null ? (
          <TagList
            key="tags"
            tags={tags}
            selected={selected}
            search={search}
            onSearchChange={setSearch}
            inputRef={inputRef}
            shortcut={shortcut}
            onToggle={toggle}
            onStartCreate={startCreate}
          />
        ) : (
          <ColorList key="colors" search={search} onSearchChange={setSearch} inputRef={inputRef} onPick={create} />
        )}
      </PopoverContent>
    </Popover>
  )
}

const TagList = ({
  tags,
  selected,
  search,
  onSearchChange,
  inputRef,
  shortcut,
  onToggle,
  onStartCreate,
}: {
  tags: PickerTag[]
  selected: Set<string>
  search: string
  onSearchChange: (value: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  shortcut?: string
  onToggle: (id: string) => void
  onStartCreate: (name: string) => void
}) => {
  const query = search.trim()
  const lower = query.toLowerCase()
  const exactMatch = tags.some((tag) => tag.name.toLowerCase() === lower)
  const matches = query ? tags.filter((tag) => tag.name.toLowerCase().includes(lower)) : tags
  const frequent = !query && tags.length >= GROUP_THRESHOLD ? rankFrequentTags(tags) : []
  const frequentIds = new Set(frequent.map((tag) => tag.id))
  const rest = matches.filter((tag) => !frequentIds.has(tag.id))

  return (
    <Command shouldFilter={false} loop className={cn("rounded-none! p-0")}>
      <PickerInput value={search} onValueChange={onSearchChange} inputRef={inputRef} placeholder="Tags hinzufügen …" shortcut={shortcut} />
      <CommandList className={cn("max-h-80")}>
        {tags.length === 0 && !query ? <p className={cn("px-3 py-2.5 text-sm text-neutral-500")}>Noch keine Tags. Tippe einen Namen, um einen anzulegen.</p> : null}
        {frequent.length > 0 ? (
          <>
            <CommandGroup heading="Häufig verwendet">
              {frequent.map((tag) => (
                <TagItem key={tag.id} tag={tag} checked={selected.has(tag.id)} onSelect={() => onToggle(tag.id)} />
              ))}
            </CommandGroup>
            {rest.length > 0 ? <CommandSeparator className={cn("mx-0")} /> : null}
          </>
        ) : null}
        {rest.length > 0 ? (
          <CommandGroup heading={frequent.length > 0 ? "Weitere Tags" : undefined}>
            {rest.map((tag) => (
              <TagItem key={tag.id} tag={tag} checked={selected.has(tag.id)} onSelect={() => onToggle(tag.id)} />
            ))}
          </CommandGroup>
        ) : null}
        {query && !exactMatch ? (
          <CommandGroup>
            <CommandItem value="__create__" onSelect={() => onStartCreate(query)} className={cn("h-8 gap-2.5 rounded-md")}>
              <Plus strokeWidth={1.5} className={cn("size-4")} />
              <span className={cn("truncate")}>
                Neuen Tag erstellen: <span className={cn("text-neutral-500")}>„{query}“</span>
              </span>
            </CommandItem>
          </CommandGroup>
        ) : null}
      </CommandList>
    </Command>
  )
}

const ColorList = ({
  search,
  onSearchChange,
  inputRef,
  onPick,
}: {
  search: string
  onSearchChange: (value: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onPick: (color: string) => void
}) => {
  useEffect(() => inputRef.current?.focus(), [inputRef])
  return (
    <Command loop className={cn("rounded-none! p-0")}>
      <PickerInput value={search} onValueChange={onSearchChange} inputRef={inputRef} placeholder="Farbe für Tag wählen" />
      <CommandList className={cn("max-h-80")}>
        <CommandPrimitive.Empty className={cn("px-3 py-2.5 text-sm text-neutral-500")}>Keine Farbe gefunden.</CommandPrimitive.Empty>
        <CommandGroup>
          {TAG_COLORS.map((color) => (
            <CommandItem key={color.value} value={color.name} onSelect={() => onPick(color.value)} className={cn("h-8 gap-2.5 rounded-md")}>
              <TagDot color={color.value} />
              <span>{color.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

const PickerInput = ({
  value,
  onValueChange,
  inputRef,
  placeholder,
  shortcut,
}: {
  value: string
  onValueChange: (value: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  placeholder: string
  shortcut?: string
}) => (
  <div className={cn("flex h-10 items-center gap-2 border-b border-neutral-200 px-3 dark:border-neutral-800")}>
    <CommandPrimitive.Input
      ref={inputRef}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      className={cn("min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-neutral-500")}
    />
    {shortcut ? (
      <kbd className={cn("flex h-5 min-w-5 items-center justify-center rounded border border-neutral-200 px-1 font-sans text-xs text-neutral-500 dark:border-neutral-800")}>
        {shortcut.toUpperCase()}
      </kbd>
    ) : null}
  </div>
)

const TagItem = ({ tag, checked, onSelect }: { tag: PickerTag; checked: boolean; onSelect: () => void }) => (
  <CommandItem value={tag.id} onSelect={onSelect} aria-checked={checked} className={cn("h-8 gap-2.5 rounded-md")}>
    <span
      data-checked={checked}
      className={cn(
        "flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border border-neutral-300 opacity-0 group-data-[selected=true]/command-item:opacity-100 data-[checked=true]:border-black data-[checked=true]:bg-black data-[checked=true]:text-white data-[checked=true]:opacity-100 dark:border-neutral-700 dark:data-[checked=true]:border-white dark:data-[checked=true]:bg-white dark:data-[checked=true]:text-black"
      )}
    >
      {checked ? <Check strokeWidth={2.5} className={cn("size-3")} /> : null}
    </span>
    <TagDot color={tag.color} />
    <span className={cn("truncate")}>{tag.name}</span>
  </CommandItem>
)

export const TagDot = ({ color, className }: { color: string; className?: string }) => (
  <span className={cn("size-2 shrink-0 rounded-full", className)} style={{ backgroundColor: tagSwatchColor(color) }} />
)
