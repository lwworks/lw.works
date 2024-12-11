'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {useEffect, useState} from 'react'
import {usePathname, useSearchParams} from 'next/navigation'
import {Locale, i18n} from '@/i18n.config'
import {getCookie, setCookie} from '@/app/actions'
import {getEquivalentPathname} from '@/utils/i18n/get-equivalent-pathname'

export const LanguageButton = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [locale, setLocale] = useState<Locale>(pathname.split('/')[1] as Locale)

  useEffect(() => {
    const equivalentPathname = getEquivalentPathname(pathname, locale)
    const currentLocale = pathname!.split('/')[1]
    if (currentLocale !== locale) {
      window.location.href = `${equivalentPathname === pathname ? pathname.replace(currentLocale, locale) : equivalentPathname}?${searchParams.toString()}`
    }
  }, [locale, pathname])

  const onChange = async (value: string) => {
    const consent = await getCookie('consent')
    if (consent?.value) {
      await setCookie('locale', value)
    }
    setLocale(value as Locale)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center justify-center size-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white focus:bg-black/10 focus:outline-none dark:focus:bg-white/10">
        <span className="font-mono uppercase text-base">{locale}</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={0} className="relative z-50 rounded-full bg-black text-white dark:text-black dark:bg-white p-1 shadow-lg">
          <DropdownMenu.RadioGroup value={locale} onValueChange={onChange}>
            {i18n.locales.map((locale) => (
              <DropdownMenu.RadioItem
                key={locale}
                value={locale}
                className="relative flex size-8 cursor-pointer justify-center items-center rounded-full focus:bg-white/20 focus:outline-none data-[state=checked]:text-rose-400 dark:focus:bg-black/10"
              >
                <span className="relative font-mono uppercase text-base">{locale}</span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
