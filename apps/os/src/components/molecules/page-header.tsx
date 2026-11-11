import { Heading } from "@lw/ui/atoms/heading"
import { cn } from "@lw/ui/lib/utils"

export type PageHeaderProps = {
  title: string
  description?: React.ReactNode
  children?: React.ReactNode
}

export const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-16 py-8")}>
      <Heading as="h1" size="h3" className="col-start-1 row-start-1">{title}</Heading>
      {children ? <div className={cn("col-start-2 row-start-1 flex items-center gap-2")}>{children}</div> : null}
      {description ? <p className={cn("col-start-1 row-start-2 max-w-2xl text-sm")}>{description}</p> : null}
    </div>
  )
}
