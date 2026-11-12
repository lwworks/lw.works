"use client"

import { Button } from "@lw/ui/components/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@lw/ui/components/dropdown-menu"
import { Menu } from "@mynaui/icons-react"
import Link from "next/link"
import { navItems } from "./nav-items"

/** Main navigation below the `2xl` breakpoint, where the sidebar is hidden. */
export const MobileNav = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="2xl:hidden" aria-label="Navigation öffnen">
          <Menu strokeWidth={1.5} className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {navItems.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={label} asChild>
            <Link href={href}>
              <Icon strokeWidth={1.5} />
              <span>{label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
