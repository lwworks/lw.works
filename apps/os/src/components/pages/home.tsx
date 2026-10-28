import { Skeleton } from "@lw/ui/components/skeleton"
import { Layout } from "../molecules/layout"

export const HomePage = () => {
  return (
    <Layout>
      <div className="p-16 py-9">
        Das ist das Dashboard.
      </div>
    </Layout>
  )
}

export const HomePageSkeleton = () => {
  return (
    <Layout>
      <div className="p-16 py-9" aria-busy="true">
        <Skeleton className="h-5 w-48" />
      </div>
    </Layout>
  )
}
