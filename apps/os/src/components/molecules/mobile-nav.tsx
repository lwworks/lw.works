"use client"

import { Button } from "@lw/ui/components/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@lw/ui/components/dropdown-menu"
import { cn } from "@lw/ui/lib/utils"
import { Menu } from "@mynaui/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"
import { isWithinPath } from "@/lib/navigation/is-within-path"
import { navItems } from "./nav-items"

/** Main navigation below the `2xl` breakpoint, where the sidebar is hidden. */
export const MobileNav = ({ isAdmin }: { isAdmin: boolean }) => {
  const pathname = usePathname()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="2xl:hidden" aria-label="Navigation öffnen">
          <Menu strokeWidth={1.5} className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {navItems
          .filter((item) => isAdmin || !item.adminOnly)
          .map(({ href, label, icon: Icon, children }) => (
            <Fragment key={label}>
              <DropdownMenuItem asChild>
                <Link href={href}>
                  <Icon strokeWidth={1.5} />
                  <span>{label}</span>
                </Link>
              </DropdownMenuItem>
              {children && isWithinPath(pathname, href)
                ? children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link href={child.href} className={cn("pl-8", isWithinPath(pathname, child.href) && "font-medium")}>{child.label}</Link>
                    </DropdownMenuItem>
                  ))
                : null}
            </Fragment>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
