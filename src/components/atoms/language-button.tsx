'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'
import {useRouter} from 'next/navigation'
import {i18n} from '@/i18n.config'

export const LanguageButton = () => {
  const pathName = usePathname()
  const router = useRouter()
  const [locale, setLocale] = useState<string>(pathName ? pathName.split('/')[1] : i18n.defaultLocale)

  useEffect(() => {
    if (!pathName) router.push('/')
    const segments = pathName!.split('/')
    segments[1] = locale
    if (pathName?.split('/')[1] != locale) router.push(segments.join('/'))
  }, [locale, pathName, router])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex h-9 items-center rounded px-3 text-indigo-500 hover:text-indigo-700 focus:bg-white/30 focus:outline-none dark:text-indigo-300 dark:hover:text-indigo-200 dark:focus:bg-white/10 md:h-7 md:px-2">
        <span className="font-mono uppercase md:text-sm">{locale}</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          className="relative z-50 mt-3.5 rounded-lg border border-slate-200 bg-slate-100/60 p-2 shadow-lg backdrop-blur-lg dark:border-slate-700 dark:bg-black/70 md:mt-0"
        >
          <DropdownMenu.RadioGroup value={locale} onValueChange={(locale) => setLocale(locale)}>
            {i18n.locales.map((locale) => (
              <DropdownMenu.RadioItem
                key={locale}
                value={locale}
                className={`relative flex h-9 items-center rounded border border-transparent px-3 font-mono uppercase focus:bg-white/30 focus:outline-none data-[state=checked]:text-indigo-500 dark:focus:bg-white/10 dark:data-[state=checked]:text-indigo-300 md:h-7 md:px-2 md:text-sm`}
              >
                <DropdownMenu.ItemIndicator className="absolute inset-2 bg-indigo-400/80 blur-md" />
                <span className="relative">{locale}</span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Arrow className="relative z-10 -mb-px h-1.5 w-3 fill-current text-transparent md:text-slate-200 dark:md:text-slate-700" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
