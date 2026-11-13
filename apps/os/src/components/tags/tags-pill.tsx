import { tagSwatchColor } from "@/lib/tags/tag-swatch-color"
import { cn } from "@lw/ui/lib/utils"
import type { ComponentProps } from "react"

type PillTag = { id: string; name: string; color: string }

/** One tag shows as itself; several collapse into a single pill with stacked dots and a count. */
export const TagsPill = ({ tags, className, ...props }: { tags: PillTag[] } & ComponentProps<"button">) => {
  const [first] = tags
  if (!first) return null
  const many = tags.length > 1
  return (
    <button
      type="button"
      title={many ? tags.map((tag) => tag.name).join(", ") : undefined}
      className={cn(
        "inline-flex h-6 max-w-48 items-center gap-1.5 rounded-full border px-2 text-sm hover:bg-neutral-100 hover:text-black disabled:opacity-50 dark:hover:bg-neutral-900 dark:hover:text-white",
        className
      )}
      {...props}
    >
      {many ? (
        <>
          <span className={cn("flex items-center")}>
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={tag.id}
                className={cn("size-2 shrink-0 rounded-full ring-[1.5px] ring-background", index > 0 && "-ml-0.5")}
                style={{ backgroundColor: tagSwatchColor(tag.color) }}
              />
            ))}
          </span>
          <span>{tags.length} Tags</span>
        </>
      ) : (
        <>
          <span className={cn("size-2 shrink-0 rounded-full")} style={{ backgroundColor: tagSwatchColor(first.color) }} />
          <span className={cn("truncate")}>{first.name}</span>
        </>
      )}
    </button>
  )
}
