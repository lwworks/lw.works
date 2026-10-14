import { Button } from "@lw/ui/components/button"
import { Activity, Clock3, CreditCard, Folder, User } from "@mynaui/icons-react"
import Link from "next/link"

export const Sidebar = () => {
  return (
    <aside className="hidden 2xl:block absolute inset-y-0 -left-64 w-64 pb-px">
      <div className="sticky top-16 h-[calc(100vh-64px)] border-l border-black/10 dark:border-white/10 p-8 overflow-y-auto flex flex-col items-stretch">
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/">
            <Activity strokeWidth={1.5} />
            <span>Dashboard</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/kontakte">
            <User strokeWidth={1.5} />
            <span>Kontakte</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/">
            <Clock3 strokeWidth={1.5} />
            <span>Zeiterfassung</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/">
            <Folder strokeWidth={1.5} />
            <span>Projekte</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/">
            <CreditCard strokeWidth={1.5} />
            <span>Finanzen</span>
          </Link>
        </Button>
      </div>
    </aside>
  )
}