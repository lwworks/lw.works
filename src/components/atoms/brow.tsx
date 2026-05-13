import { cn } from "@/lib/utils"

type BrowProps = {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  variant?: 'default' | 'small' | 'xs'
  color?: 'indigo' | 'rose' | 'emerald'
  children: React.ReactNode
  className?: string
}

export const Brow = ({ as = 'span', variant = 'default', color = 'indigo', children, className }: BrowProps) => {
  const Tag = as

  return (
    <div className={cn("font-mono uppercase", variant === "small" && "text-xs", variant === "xs" && "text-[10px]", variant === "default" && "text-sm flex items-center gap-2 -mr-16", className)}>
      <Tag className="shrink-0">{children}</Tag>
      {variant === "default" && (
        <div className="flex-1 flex items-center">
          <span className={cn("size-1 shrink-0",
            color === 'indigo' && 'bg-indigo-500',
            color === 'rose' && 'bg-rose-500',
            color === 'emerald' && 'bg-emerald-500',
          )} />
          <span className={cn("h-px flex-1 bg-linear-to-l from-black/10 dark:from-white/10 via-black/10 dark:via-white/10",
            color === 'indigo' && 'to-indigo-500/50',
            color === 'rose' && 'to-rose-500/50',
            color === 'emerald' && 'to-emerald-500/50',
          )} />
        </div>
      )}
    </div>
  )
}