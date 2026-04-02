import { cn } from "@/lib/utils"

type BrowProps = {
  as: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: React.ReactNode
  className?: string
}

export const Brow = ({ as = "span", children, className }: BrowProps) => {
  const Tag = as
  return (
    <Tag className={cn("font-mono text-sm uppercase font-medium flex items-center gap-2 text-muted-foreground", className)}>
      <span>{children}</span>
      <span className="text-xs font-semibold text-rose-400">///</span>
    </Tag>
  )
}