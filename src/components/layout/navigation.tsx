'use client'
import {Button} from '@/components/atoms/button'
import {Logo} from '@/components/visuals/logo'
import Link from 'next/link'
import {motion} from 'framer-motion'
import {MouseEventHandler, useEffect, useRef, useState} from 'react'
import {usePathname} from 'next/navigation'
import {LanguageButton} from '@/components/atoms/language-button'
import {ThemeButton} from '@/components/atoms/theme-button'
import {MenuIcon} from '@/components/icons/menu'
import {CloseIcon} from '@/components/icons/close'
import {CartIcon} from '@/components/icons/cart'

const links = [
  {href: 'https://lukaswiesehan.de/work', caption: 'Work'},
  {href: '/blog', caption: 'Blog'},
  {href: '/hardware', caption: 'Hardware'}
]

export const Navigation = () => {
  const [offsetX, setOffsetX] = useState<number>(0)
  const container = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [open, setOpen] = useState<boolean>(false)
  const [cart, setCart] = useState<{id: string; totalQuantity: number} | null>(null)

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    setOffsetX(e.clientX - container.current?.getBoundingClientRect().left!)
  }

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onStorageChange = () => {
      if ('cart' in localStorage) {
        const cart = JSON.parse(localStorage.cart)
        setCart(cart)
      }
    }
    onStorageChange()
    window.addEventListener('storage', onStorageChange, false)
    return () => window.removeEventListener('storage', onStorageChange)
  }, [])

  return (
    <nav className="relative z-50 w-full pt-4 md:pt-6 lg:pt-10">
      <div className="fixed top-4 w-full px-4 sm:px-6 md:hidden">
        <div className="relative z-50 flex h-12 items-center justify-between rounded-3xl border border-slate-200 bg-slate-100/60 pl-5 pr-1.5 shadow-lg shadow-black/5 backdrop-blur-lg dark:border-slate-700 dark:bg-black/70 dark:shadow-black/10">
          <Link href="/hardware">
            <Logo className="h-5 text-black dark:text-white md:h-8" />
          </Link>
          <div className="absolute -bottom-px h-px w-8 overflow-y-hidden">
            <div className="mx-auto -mt-6 h-12 w-1/3 bg-white opacity-80 blur" />
          </div>
          <div className="flex space-x-2">
            {pathname?.split('/')[1] === 'hardware' && cart !== null && cart.totalQuantity > 0 && (
              <Button hideArrow secondary href="/hardware/cart">
                <div className="flex items-center space-x-2">
                  <CartIcon className="h-4 opacity-70" />
                  <span className="font-mono text-xs leading-none text-black dark:text-white">{cart.totalQuantity}</span>
                </div>
              </Button>
            )}
            <Button action={() => setOpen((open) => !open)} secondary hideArrow>
              {open ? <CloseIcon className="h-5" /> : <MenuIcon className="h-5" />}
            </Button>
          </div>
        </div>
        {open && (
          <>
            <div className="fixed inset-0 bg-white/40 backdrop-blur-lg dark:bg-black/20" onClick={() => setOpen((open) => !open)} />
            <div className="fixed inset-x-4 mt-2 flex h-48 flex-col items-center justify-between rounded-3xl border border-slate-200 bg-slate-200/50 p-4 pb-6 shadow-lg shadow-black/5 dark:border-slate-700 dark:bg-black/70 dark:shadow-black/10 sm:inset-x-6">
              <ul className="relative flex items-center justify-center space-x-4">
                {links.map(({href, caption}, index) => {
                  const active = pathname?.split('/')[1] === href.split('/')[1]
                  return (
                    <li key={index} className="relative">
                      <Link
                        href={href}
                        className={`relative flex h-7 items-center rounded px-2 font-bold focus:bg-white/10 focus:outline-none ${
                          active ? 'text-black dark:text-white' : 'text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white'
                        }`}
                      >
                        {caption}
                      </Link>
                      {active && (
                        <div className="absolute -inset-x-2 -top-[17px] h-px overflow-y-hidden">
                          <div className="mx-auto -mt-6 h-12 w-2/3 bg-white opacity-80 blur" />
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
              <Button href="https://lukaswiesehan.de/contact">Gespräch vereinbaren</Button>
              <div className="relative flex h-5 items-center">
                <LanguageButton />
                <ThemeButton />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="relative mx-auto hidden w-full max-w-screen-xl items-center justify-end px-8 md:flex lg:px-12">
        <div className="absolute top-0 left-8 flex h-12 items-center lg:left-12">
          <Link href="/hardware">
            <Logo className="h-8 text-black dark:text-white md:h-8" />
          </Link>
        </div>
        <motion.div
          onMouseMove={onMouseMove}
          ref={container}
          className="group fixed top-6 flex h-12 items-center rounded-3xl border border-slate-200 bg-slate-100/60 pr-1.5 shadow-lg shadow-black/5 backdrop-blur-lg dark:border-slate-700 dark:bg-black/70 dark:shadow-black/10 lg:top-10"
        >
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <motion.div
              className="absolute -bottom-3 -left-10 h-6 w-20 rounded-full bg-white/70 opacity-0 blur-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-white/30"
              style={{translateX: offsetX}}
            />
          </div>
          <ul className="relative flex items-center space-x-4 pl-4">
            {links.map(({href, caption}, index) => {
              const active = pathname?.split('/')[1] === href.split('/')[1]
              return (
                <li key={index} className="relative">
                  <Link
                    href={href}
                    className={`relative flex h-7 items-center rounded px-2 font-bold focus:bg-white/30 focus:outline-none dark:focus:bg-white/10 ${
                      active ? 'text-black dark:text-white' : 'text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    {caption}
                  </Link>
                  {active && (
                    <div className="absolute inset-x-0 mt-[9px] h-px overflow-y-hidden">
                      <div className="mx-auto -mt-6 h-12 w-2/3 bg-white opacity-80 blur" />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          <div className="relative ml-4 mr-6 flex h-5 items-center border-x border-slate-100/70 px-3 dark:border-slate-600">
            <LanguageButton />
            <ThemeButton />
          </div>
          {pathname?.split('/')[1] !== 'hardware' ? (
            <Button href="https://lukaswiesehan.de/contact">Gespräch vereinbaren</Button>
          ) : cart === null || cart?.totalQuantity === 0 ? (
            <Button href="https://lukaswiesehan.de/contact">Gespräch vereinbaren</Button>
          ) : (
            <Button hideArrow href="/hardware/cart">
              <div className="-mr-1.5 flex items-center space-x-2">
                <CartIcon className="h-4 opacity-70" />
                <span>Warenkorb</span>
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/25 px-1 font-mono text-xs leading-none text-white opacity-70">
                  {cart.totalQuantity}
                </span>
              </div>
            </Button>
          )}
        </motion.div>
      </div>
    </nav>
  )
}
