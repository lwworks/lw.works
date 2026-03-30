import Link from "next/link"
import { Logo } from "../atoms/logo"
import { Button } from "../ui/button"

export const Header = () => {
  return (
    <header className="flex items-center justify-between w-full max-w-5xl mx-auto px-8 h-20">
      <Logo className="text-black dark:text-white h-6" />
      <nav className="flex items-center gap-4">
        <Button asChild>
          <Link href="/">Call vereinbaren</Link>
        </Button>
      </nav>
    </header>
  )
}