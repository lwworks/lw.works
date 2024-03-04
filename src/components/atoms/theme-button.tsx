'use client'
import {deleteCookie, getCookie, setCookie} from '@/app/actions'
import {GearIcon} from '@/components/icons/gear'
import {MoonIcon} from '@/components/icons/moon'
import {SunIcon} from '@/components/icons/sun'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {useEffect, useState} from 'react'

const themes = [
  {id: 'light', name: 'Light Mode', icon: SunIcon},
  {id: 'dark', name: 'Dark Mode', icon: MoonIcon},
  {id: 'system', name: 'System Preference', icon: GearIcon}
]

export const ThemeButton = () => {
  const [theme, setTheme] = useState<string>()

  useEffect(() => {
    const checkCookie = async () => {
      const cookie = await getCookie('theme')
      setTheme(cookie?.value ?? 'system')
    }
    checkCookie()
  }, [])

  useEffect(() => {
    if (!theme) return
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
      document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  const onChange = async (value: string) => {
    const consent = await getCookie('consent')
    if (consent?.value) {
      if (value === 'system') await deleteCookie('theme')
      else await setCookie('theme', value)
    }
    setTheme(value)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex h-9 items-center rounded px-3 text-indigo-500 hover:text-indigo-700 focus:bg-white/30 focus:outline-none dark:text-indigo-300 dark:hover:text-indigo-200 dark:focus:bg-white/10 md:h-7 md:px-2">
        <span className="">
          <MoonIcon className="theme-icon-dark h-5 md:h-4" />
          <SunIcon className="theme-icon-light h-5 md:h-4" />
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          className="relative z-50 mt-3.5 rounded-lg border border-slate-200 bg-slate-100/60 p-2 shadow-lg backdrop-blur-lg dark:border-slate-700 dark:bg-black/70 md:mt-0"
        >
          <DropdownMenu.RadioGroup value={theme} onValueChange={onChange}>
            {themes.map(({id, icon}, index) => {
              const Icon = icon
              return (
                <DropdownMenu.RadioItem
                  key={index}
                  value={id}
                  className="relative flex h-9 cursor-pointer items-center rounded border border-transparent px-3 focus:bg-white/30 focus:outline-none data-[state=checked]:text-indigo-500 dark:focus:bg-white/10 dark:data-[state=checked]:text-indigo-300 md:h-7 md:px-2"
                >
                  <DropdownMenu.ItemIndicator className="absolute inset-2 bg-indigo-400/80 blur-md" />
                  <Icon className="relative h-5 md:h-4" />
                </DropdownMenu.RadioItem>
              )
            })}
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Arrow className="relative z-10 -mb-px h-1.5 w-3 fill-current text-transparent md:text-slate-200 dark:md:text-slate-700" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
