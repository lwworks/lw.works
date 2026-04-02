import { cn } from "@/lib/utils"

type CTAProps = {
  children: React.ReactNode
  className?: string
}

export const CTA = ({ children, className }: CTAProps) => {
  return (
    <div className={cn("flex items-center gap-4 mt-8", className)}>
      {children}
    </div>
  )
}