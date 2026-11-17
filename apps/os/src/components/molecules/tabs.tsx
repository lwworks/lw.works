import { cn } from "@lw/ui/lib/utils"
import Link from "next/link"
import type { ComponentProps } from "react"

/**
 * Underlined tabs that sit on the top border of the table or section below them: `-mb-px` lays the
 * active tab's border onto that border. Tabs are links (filters live in the URL), see `TabLink`.
 */
export const TabNav = ({ className, ...props }: ComponentProps<"nav">) => (
  <nav className={cn("relative z-10 -mb-px flex flex-wrap gap-x-4 text-sm", className)} {...props} />
)

const tabClassName = (active: boolean) =>
  cn(
    "border-b border-transparent pb-2.5 hover:text-black dark:hover:text-white",
    active && "border-black font-medium text-black dark:border-white dark:text-white",
  )

/** A tab that switches the URL without scrolling. */
export const TabLink = ({ active, className, ...props }: ComponentProps<typeof Link> & { active: boolean }) => (
  <Link scroll={false} aria-current={active ? "page" : undefined} className={cn(tabClassName(active), className)} {...props} />
)

/** A tab that opens something instead of navigating, e.g. a popover trigger. */
export const TabButton = ({ active, className, ...props }: ComponentProps<"button"> & { active: boolean }) => (
  <button type="button" className={cn(tabClassName(active), className)} {...props} />
)
