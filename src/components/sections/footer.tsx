import Image from "next/image"
import Link from "next/link"
import { CookieBanner } from "../atoms/cookie-banner"
import { Logo } from "../atoms/logo"

const copyrightNote = `© LW Works GmbH ${new Date().getFullYear()}`

const menus = [
  {
    heading: 'Work',
    items: [
      { label: 'Prozess-Check', href: '/check' },
      { label: 'Digitalisierung', href: '/' },
    ],
  },
  {
    heading: 'Unternehmen',
    items: [
      { label: 'Kontakt', href: '/contact' },
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
    ],
  },
]

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden text-sm text-neutral-500 dark:text-neutral-400">
      <div className="absolute inset-0">
        <Image src="/images/paint/footer-light.jpg" alt="Footer Background" fill className="object-cover object-bottom dark:hidden" />
        <Image src="/images/paint/footer-dark.jpg" alt="Footer Background" fill className="object-cover object-bottom hidden dark:block" />
      </div>
      <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-black/10 dark:border-white/10 py-24 flex gap-16 justify-between items-stretch">
        <div className="flex flex-col gap-4 justify-between">
          <Link href="/">
            <Logo className="text-black dark:text-white h-5" />
          </Link>
          <p className="text-sm">{copyrightNote}</p>
        </div>
        <div className="flex gap-16">
          {menus.map((menu, index) => (
            <div key={menu.heading} className="shrink-0 whitespace-nowrap">
              <h4 className="font-semibold text-black dark:text-white text-[11px] uppercase mb-3 tracking-widest">{menu.heading}</h4>
              <ul className="space-y-1">
                {menu.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-black dark:hover:text-white">{item.label}</Link>
                  </li>
                ))}
                {index === menus.length - 1 && (
                  <li>
                    <CookieBanner />
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
