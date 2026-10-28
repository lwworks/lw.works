import { Heading } from "@lw/ui/atoms/heading"

export type PageHeaderProps = {
  title: string
  description?: React.ReactNode
  children?: React.ReactNode
}

export const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className="px-16 py-8">
      <div className="flex items-center justify-between gap-4">
        <Heading as="h1" size="h3">{title}</Heading>
        {children ? <div className="flex items-center gap-2">{children}</div> : null}
      </div>
      {description ? <p className="text-sm">{description}</p> : null}
    </div>
  )
}
