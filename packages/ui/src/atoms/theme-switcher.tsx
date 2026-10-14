'use client'

import { Button } from '@lw/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@lw/ui/components/dropdown-menu'
import { cn } from '@lw/ui/lib/utils'
import { Check, Moon, Sun } from '@mynaui/icons-react'
import { useTheme } from 'next-themes'

export type ThemeSwitcherContent = {
  light: string
  dark: string
  system: string
}

export const ThemeSwitcher = ({ content }: { content: ThemeSwitcherContent }) => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <Sun strokeWidth={1.5} className="dark:hidden" />
          <Moon strokeWidth={1.5} className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          key="light"
          onClick={() => setTheme("light")}
        >
          <Check className={cn('opacity-0', theme === "light" && 'opacity-100')} />
          {content.light}
        </DropdownMenuItem>
        <DropdownMenuItem
          key="dark"
          onClick={() => setTheme("dark")}
        >
          <Check className={cn('opacity-0', theme === "dark" && 'opacity-100')} />
          {content.dark}
        </DropdownMenuItem><DropdownMenuItem
          key="system"
          onClick={() => setTheme("system")}
        >
          <Check className={cn('opacity-0', theme === "system" && 'opacity-100')} />
          {content.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
