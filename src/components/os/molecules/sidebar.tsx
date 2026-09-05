import { Button } from "@/components/ui/button"
import { Activity, Clock3, CreditCard, Folder, User } from "@mynaui/icons-react"
import Link from "next/link"

export const Sidebar = () => {
  return (
    <aside className="hidden 2xl:block absolute inset-y-0 -left-64 w-64 pb-px">
      <div className="sticky top-16 h-[calc(100vh-64px)] border-l border-black/10 dark:border-white/10 p-8 overflow-y-auto flex flex-col items-stretch">
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/os">
            <Activity strokeWidth={1.5} />
            <span>Dashboard</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/os">
            <User strokeWidth={1.5} />
            <span>Kontakte</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/os">
            <Clock3 strokeWidth={1.5} />
            <span>Zeiterfassung</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/os">
            <Folder strokeWidth={1.5} />
            <span>Projekte</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/os">
            <CreditCard strokeWidth={1.5} />
            <span>Finanzen</span>
          </Link>
        </Button>
      </div>
    </aside>
  )
}