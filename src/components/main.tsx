import { cn } from "@/lib/utils"

export const Main = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <main className={cn("pt-16 min-h-screen flex flex-col", className)}>
      {children}
    </main>
  )
}