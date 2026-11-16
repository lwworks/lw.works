import { DashboardFinancesTile } from "@/components/finance/dashboard-finances-tile"
import type { DashboardFinances } from "@/lib/finance/get-dashboard-finances"
import { Layout } from "../molecules/layout"

export const HomePage = ({ finances }: { finances: DashboardFinances | null }) => {
  return (
    <Layout>
      <div className="p-16 py-9">
        Das ist das Dashboard.
      </div>
      {finances ? <DashboardFinancesTile finances={finances} /> : null}
    </Layout>
  )
}
