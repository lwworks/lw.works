import { cn } from "@/lib/utils"

type BrowProps = {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  variant?: 'default' | 'small' | 'xs'
  color?: 'none' | 'lime' | 'lavender'
  children: React.ReactNode
  className?: string
}

export const Brow = ({ as = 'span', variant = 'default', color = 'lime', children, className }: BrowProps) => {
  const Tag = as

  return (
    <div className={cn("font-mono uppercase", variant === "small" && "text-xs", variant === "xs" && "text-[10px]", variant === "default" && "text-xs sm:text-sm flex items-center gap-2.5", className)}>
      <Tag className="shrink-0">{children}</Tag>
      {color !== "none" && (
        <svg viewBox="0 0 29 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-2.5 sm:h-3", color === "lime" && "fill-lime", color === "lavender" && "fill-lavender")}>
          <rect width="21.0101" height="32" transform="matrix(1 0 -0.224951 0.97437 7.19824 0)" />
          <rect x="0.775049" y="0.97437" width="19.0101" height="30" transform="matrix(1 0 -0.224951 0.97437 7.41743 0.024973)" stroke="black" strokeOpacity="0.05" strokeWidth="3.5" fill="none" />
        </svg>
      )}
    </div>
  )
}