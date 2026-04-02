'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Check, Sun } from '@mynaui/icons-react'
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
          <Sun />
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
