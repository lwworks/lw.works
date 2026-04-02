'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Check, Globe } from '@mynaui/icons-react'
import { useLocale } from 'next-intl'

const locales = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
] as const

export const LangSwitcher = () => {
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
        {locales.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => router.replace(pathname as '/', { locale: code })}
          >
            <Check className={cn('opacity-0', locale === code && 'opacity-100')} />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
