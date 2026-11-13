"use client"

import { createPickedTagAction } from "@/app/kontakte/actions"
import { TagPicker, type PickerTag } from "@/components/tags/tag-picker"
import { toast } from "@lw/ui/components/sonner"
import { useState, useTransition } from "react"

/** Tag picker for a form: the selection is submitted as hidden `name` inputs. New tags are created right away. */
export const TagPickerField = ({ tags, defaultSelectedIds = [], name = "tagIds" }: { tags: PickerTag[]; defaultSelectedIds?: string[]; name?: string }) => {
  const [selectedIds, setSelectedIds] = useState(defaultSelectedIds)
  const [created, setCreated] = useState<PickerTag[]>([])
  const [pending, startTransition] = useTransition()
  const known = new Set(tags.map((tag) => tag.id))
  const allTags = [...tags, ...created.filter((tag) => !known.has(tag.id))]

  const toggle = (id: string) => setSelectedIds((ids) => (ids.includes(id) ? ids.filter((tagId) => tagId !== id) : [...ids, id]))

  const create = (tagName: string, color: string) => {
    startTransition(async () => {
      const result = await createPickedTagAction(tagName, color)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      setCreated((list) => [...list, { id: result.id, name: tagName, color, usageCount: 0 }])
      setSelectedIds((ids) => [...ids, result.id])
    })
  }

  return (
    <>
      {selectedIds.map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}
      <TagPicker tags={allTags} selectedIds={selectedIds} onToggle={toggle} onCreate={create} disabled={pending} />
    </>
  )
}
