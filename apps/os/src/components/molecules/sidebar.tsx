import { Button } from "@lw/ui/components/button"
import Link from "next/link"
import { navItems } from "./nav-items"

export const Sidebar = () => {
  return (
    <aside className="hidden 2xl:block absolute inset-y-0 -left-64 w-64 pb-px">
      <div className="sticky top-16 h-[calc(100vh-64px)] border-l border-black/10 dark:border-white/10 p-8 overflow-y-auto flex flex-col items-stretch">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Button key={label} variant="ghost" asChild className="justify-start">
            <Link href={href}>
              <Icon strokeWidth={1.5} />
              <span>{label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </aside>
  )
}
