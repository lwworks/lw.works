import { Link } from "@/i18n/navigation"
import { ComponentProps } from "react"
import { LangSwitcher } from "../atoms/lang-switcher"
import { Logo } from "../atoms/logo"
import { Button } from "../ui/button"

export type HeaderContent = {
  items: {
    label: string
    href: string
  }[],
  cta: {
    href: string
    label: string
  }
}

export const Header = ({ content }: { content: HeaderContent }) => {
  return (
    <header className="border-b border-black/10 h-16 fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50">
      <div className="relative mx-auto w-full max-w-4xl px-16 h-full flex items-center justify-between border-x border-black/10">
        <Link href="/">
          <Logo className="text-black dark:text-white h-5" />
        </Link>
        <nav className="text-sm flex items-center gap-6">
          <ul className="flex items-center gap-4">
            {content.items.map(({ label, href }, index) => (
              <li key={index}>
                <Link href={href as ComponentProps<typeof Link>['href']} className="hover:text-black">{label}</Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href={content.cta.href as ComponentProps<typeof Link>['href']}>{content.cta.label}</Link>
            </Button>
            <LangSwitcher />
          </div>
        </nav>
      </div>
    </header>
  )
}