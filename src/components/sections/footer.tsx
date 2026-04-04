import { Link } from "@/i18n/link"
import { ComponentProps } from "react"
import { CookieBanner, CookieBannerContent } from "../atoms/cookie-banner"
import { Logo } from "../atoms/logo"

export type FooterContent = {
  copyrightNote: string
  menus: {
    heading: string
    items: {
      label: string
      href: string
    }[]
  }[]
  cookieBanner: CookieBannerContent
}

export const Footer = ({ content }: { content: FooterContent }) => {
  return (
    <footer className="text-sm text-neutral-500">
      <div className="relative mx-auto w-full max-w-4xl px-16 border-x border-black/10 dark:border-white/10 py-24 flex gap-16 justify-between items-stretch">
        <div className="flex flex-col gap-4 justify-between">
          <Link href="/">
            <Logo className="text-black dark:text-white h-5" />
          </Link>
          <p className="text-sm text-neutral-500">{content.copyrightNote}</p>
        </div>
        <div className="flex gap-16">
          {content.menus.map((menu, index) => (
            <div key={index} className="shrink-0 whitespace-nowrap">
              <h4 className="font-semibold text-black dark:text-white text-[11px] uppercase mb-3 tracking-widest">{menu.heading}</h4>
              <ul className="space-y-1">
                {menu.items.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href as ComponentProps<typeof Link>['href']} className="hover:text-black dark:hover:text-white">{item.label}</Link>
                  </li>
                ))}
                {index === content.menus.length - 1 && (
                  <li>
                    <CookieBanner content={content.cookieBanner} />
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