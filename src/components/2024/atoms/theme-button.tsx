'use client'

import {getCookie} from '@/app/actions'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {useTheme} from 'next-themes'
import {useEffect, useState} from 'react'
import {PopoverNote} from './popover-note'
import {usePathname} from 'next/navigation'
import {Locale} from '@/i18n.config'
import {Cog6ToothIcon, Cog8ToothIcon, CogIcon, ComputerDesktopIcon, MoonIcon, SunIcon} from '@heroicons/react/24/solid'

const dictionary = {
  en: {
    cookieNote: 'Accept essential cookies to use themes.'
  },
  de: {
    cookieNote: 'Akzeptiere essenzielle Cookies, um Themes zu nutzen.'
  }
}

const themes = [
  {id: 'light', name: 'Light Mode', icon: SunIcon},
  {id: 'dark', name: 'Dark Mode', icon: MoonIcon},
  {id: 'system', name: 'System Preference', icon: Cog8ToothIcon}
]

export const ThemeButton = () => {
  const [consent, setConsent] = useState<boolean>(false)
  const [showNote, setShowNote] = useState<boolean>(false)
  const {theme, setTheme} = useTheme()
  const lang = usePathname()!.split('/')[1] as Locale

  const onChange = async (value: string) => {
    setTheme(value)
  }

  useEffect(() => {
    const checkCookie = async () => {
      const cookie = await getCookie('consent')
      if (cookie?.value) setConsent(true)
    }
    checkCookie()
  }, [])

  return (
    <DropdownMenu.Root>
      <div className="relative">
        {consent ? (
          <DropdownMenu.Trigger className="flex items-center justify-center size-8 rounded-full text-black hover:bg-black/10 dark:hover:bg-white/10 dark:text-white focus:bg-black/10 focus:outline-none dark:focus:bg-white/10">
            <MoonIcon className="hidden dark:block size-4" />
            <SunIcon className="dark:hidden size-5" />
          </DropdownMenu.Trigger>
        ) : (
          <button
            onClick={() => {
              setShowNote(true)
              setTimeout(() => setShowNote(false), 3000)
            }}
            className="flex items-center justify-center size-8 rounded-full text-black hover:bg-black/10 dark:hover:bg-white/10 dark:text-white focus:bg-black/10 focus:outline-none dark:focus:bg-white/10"
          >
            <MoonIcon className="hidden dark:block size-4" />
            <SunIcon className="dark:hidden size-5" />
          </button>
        )}
        {showNote && <PopoverNote>{dictionary[lang].cookieNote}</PopoverNote>}
      </div>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={0} className="relative z-50">
          <DropdownMenu.RadioGroup
            value={theme}
            onValueChange={onChange}
            className="rounded-full bg-black text-white dark:text-black dark:bg-white p-1 shadow-lg"
          >
            {themes.map(({id, icon}, index) => {
              const Icon = icon
              return (
                <DropdownMenu.RadioItem
                  key={index}
                  value={id}
                  className="relative flex size-8 cursor-pointer justify-center items-center rounded-full focus:bg-white/20 focus:outline-none data-[state=checked]:text-rose-400 dark:focus:bg-black/10"
                >
                  <Icon className={`relative ${index === 1 ? 'size-4' : 'size-5'}`} />
                </DropdownMenu.RadioItem>
              )
            })}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
