'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Check, Globe } from '@mynaui/icons-react'
import { useLocale } from 'next-intl'

export type LangSwitcherContent = {
  de: string
  en: string
}

export const LangSwitcher = ({ content }: { content: LangSwitcherContent }) => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <Globe />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          key="de"
          onClick={() => router.replace(pathname as '/', { locale: "de" })}
        >
          <Check className={cn('opacity-0', locale === "de" && 'opacity-100')} />
          {content.de}
        </DropdownMenuItem>
        <DropdownMenuItem
          key="en"
          onClick={() => router.replace(pathname as '/', { locale: "en" })}
        >
          <Check className={cn('opacity-0', locale === "en" && 'opacity-100')} />
          {content.en}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
