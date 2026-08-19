import { Logo } from "@/components/atoms/logo"
import { ThemeSwitcher } from "@/components/atoms/theme-switcher"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const navItems: { label: string; href: string }[] = []

const themeSwitcherContent = {
  light: 'Hell',
  dark: 'Dunkel',
  system: 'System',
}

export const Header = () => {
  return (
    <header className="border-b border-black/10 dark:border-white/10 h-16 fixed top-0 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg z-50 px-4 lg:px-0">
      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-8 lg:px-16 h-full flex items-center justify-between border-x border-black/10 dark:border-white/10">
        <Link href="/">
          <Logo className="text-black dark:text-white h-5" />
        </Link>
        <nav className="text-sm flex items-center gap-4">
          <ul className="flex items-center gap-4">
            {navItems.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-black dark:hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1">
            <Button asChild size="sm">
              <Link href="/check">Prozess-Check</Link>
            </Button>
            <ThemeSwitcher content={themeSwitcherContent} />
          </div>
        </nav>
      </div>
    </header>
  )
}
