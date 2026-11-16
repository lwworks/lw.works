import { getIsAdmin } from "@/lib/auth/get-is-admin"
import { Suspense } from "react"
import { SidebarNav } from "./sidebar-nav"

const AdminAwareSidebarNav = async () => <SidebarNav isAdmin={await getIsAdmin()} />

export const Sidebar = () => {
  return (
    <aside className="hidden 2xl:block absolute inset-y-0 -left-64 w-64 pb-px">
      <div className="sticky top-16 h-[calc(100vh-64px)] border-l border-black/10 dark:border-white/10 p-8 overflow-y-auto flex flex-col items-stretch">
        {/* The role streams in with the session; until then, only the items everyone sees. */}
        <Suspense fallback={<SidebarNav isAdmin={false} />}>
          <AdminAwareSidebarNav />
        </Suspense>
      </div>
    </aside>
  )
}
