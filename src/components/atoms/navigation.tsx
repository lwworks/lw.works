import Link from "next/link"
import { Button } from "../ui/button"
import { Logo } from "./logo"

const items = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  }
]

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-between">
      <Logo className="text-black dark:text-white h-6" />
      <ul className="flex items-center gap-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
        <li>
          <Button asChild>
            <Link href="/">Call vereinbaren</Link>
          </Button>
        </li>
      </ul>
    </nav>
  )
}