"use client"

import { Button } from "@lw/ui/components/button"
import { cn } from "@lw/ui/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { isWithinPath } from "@/lib/navigation/is-within-path"
import { navItems } from "./nav-items"

export const SidebarNav = ({ isAdmin }: { isAdmin: boolean }) => {
  const pathname = usePathname()
  return navItems
    .filter((item) => isAdmin || !item.adminOnly)
    .map(({ href, label, icon: Icon, children }) => (
      <div key={label} className={cn("flex flex-col items-stretch")}>
        <Button variant="ghost" asChild className={cn("justify-start")}>
          <Link href={href}>
            <Icon strokeWidth={1.5} />
            <span>{label}</span>
          </Link>
        </Button>
        {children && isWithinPath(pathname, href)
          ? children.map((child) => (
              <Button
                key={child.href}
                variant="ghost"
                size="sm"
                asChild
                className={cn("justify-start pl-9", isWithinPath(pathname, child.href) && "font-medium text-black dark:text-white")}
              >
                <Link href={child.href} aria-current={isWithinPath(pathname, child.href) ? "page" : undefined}>{child.label}</Link>
              </Button>
            ))
          : null}
      </div>
    ))
}
