import { Link } from "@/i18n/navigation"
import type { ComponentProps } from "react"
import { Logo } from "../atoms/logo"
import { Button } from "../ui/button"

export type HeaderContent = {
  items: {
    variant: 'link' | 'primary-button' | 'secondary-button'
    label: string
    href: ComponentProps<typeof Link>['href']
  }[]
}

export const Header = ({ content }: { content: HeaderContent }) => {
  return (
    <header className="border-b border-black/10 h-16 fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50">
      <div className="relative mx-auto w-full max-w-4xl px-16 h-full flex items-center justify-between border-x border-black/10">
        <Link href="/">
          <Logo className="text-black dark:text-white h-5" />
        </Link>
        <nav className="text-sm">
          <ul className="flex items-center gap-4">
            {content.items.map(({ variant, label, href }, index) => (
              <li key={index}>
                {variant === "link" && (
                  <Link href={href} className="hover:text-black">{label}</Link>
                )}
                {variant === "primary-button" && (
                  <Button asChild size="sm">
                    <Link href={href}>{label}</Link>
                  </Button>
                )}
                {variant === "secondary-button" && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={href}>{label}</Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}