import { cn } from "@/lib/utils"

type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6
  size: "xl" | "lg" | "md" | "sm"
  children: React.ReactNode
  className?: string
}

const sizeClasses: Record<HeadingProps["size"], string> = {
  xl: "text-4xl md:text-5xl",
  lg: "text-3xl md:text-4xl",
  md: "text-2xl md:text-3xl",
  sm: "text-xl md:text-2xl",
}

export const Heading = ({ level, size, children, className }: HeadingProps) => {
  const Tag = `h${level}` as const

  return (
    <Tag className={cn("font-heading font-black tracking-tight", sizeClasses[size], className)}>
      {children}
    </Tag>
  )
}
