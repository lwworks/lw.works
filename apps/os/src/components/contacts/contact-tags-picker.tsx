"use client"

import { addNewTagToContactAction, setContactTagsAction } from "@/app/kontakte/actions"
import { TagPicker } from "@/components/tags/tag-picker"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { toast } from "@lw/ui/components/sonner"
import { useOptimistic, useTransition } from "react"

/** The contact's tags; changes are saved right away. On the detail page (chips), T opens the picker. */
export const ContactTagsPicker = ({
  displayId,
  tags,
  selectedIds,
  variant = "chips",
}: {
  displayId: number
  tags: TagListItem[]
  selectedIds: string[]
  variant?: "chips" | "compact"
}) => {
  const [, startTransition] = useTransition()
  const [optimisticIds, setOptimisticIds] = useOptimistic(selectedIds)

  const toggle = (id: string) => {
    const next = optimisticIds.includes(id) ? optimisticIds.filter((tagId) => tagId !== id) : [...optimisticIds, id]
    startTransition(async () => {
      setOptimisticIds(next)
      const result = await setContactTagsAction(displayId, next)
      if (!result.ok) toast.error(result.message)
    })
  }

  const create = (name: string, color: string) => {
    startTransition(async () => {
      const result = await addNewTagToContactAction(displayId, name, color)
      if (!result.ok) toast.error(result.message)
    })
  }

  return <TagPicker tags={tags} selectedIds={optimisticIds} onToggle={toggle} onCreate={create} variant={variant} shortcut={variant === "chips" ? "t" : undefined} />
}
