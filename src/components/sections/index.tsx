import { cn } from "@/lib/utils"

type SectionProps = {
  id?: string
  verticalPadding?: "small" | "default" | "large" | "none"
  horizontalPadding?: "default" | "none"
  bottomGradients?: "rose-orange" | "green-indigo" | "indigo-orange"
  children: React.ReactNode
  className?: string
}

export const Section = ({ id, verticalPadding = "default", horizontalPadding = "default", bottomGradients, children, className }: SectionProps) => {
  const verticalPaddings = {
    small: "py-16",
    default: "py-24",
    large: "py-32",
    none: "py-0",
  }
  const horizontalPaddings = {
    default: "px-16",
    none: "px-0",
  }

  return (
    <section id={id} className={cn("relative overflow-hidden", className)}>
      {bottomGradients === "rose-orange" && (
        <>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-32 bg-rose-400 w-3xl h-64 mx-auto blur-3xl opacity-60" style={{ borderRadius: "50% 50%" }} />
          <div className="absolute left-1/2 -translate-x-1/4 -bottom-32 bg-orange-400 w-md h-64 mx-auto blur-3xl opacity-40 mix-blend-color-burn" style={{ borderRadius: "50% 50%" }} />
        </>
      )}
      {bottomGradients === "green-indigo" && (
        <>
          <div className="absolute right-1/3 translate-x-1/4 -bottom-32 bg-green-500 w-3xl h-48 mx-auto blur-3xl opacity-60" style={{ borderRadius: "50% 50%" }} />
          <div className="absolute left-1/2 -translate-x-1/4 -bottom-32 bg-indigo-400 w-md h-48 mx-auto blur-3xl opacity-40" style={{ borderRadius: "50% 50%" }} />
        </>
      )}
      {bottomGradients === "indigo-orange" && (
        <>
          <div className="absolute right-1/3 translate-x-1/4 -bottom-32 bg-indigo-400 w-3xl h-48 mx-auto blur-3xl opacity-60" style={{ borderRadius: "50% 50%" }} />
          <div className="absolute left-1/2 -translate-x-1/4 -bottom-24 bg-orange-400 w-md h-64 mx-auto blur-3xl opacity-40 mix-blend-color-burn" style={{ borderRadius: "50% 50%" }} />
          <div className="absolute left-1/2 -translate-x-1/4 -bottom-32 bg-orange-400 w-md h-48 mx-auto blur-3xl opacity-20" style={{ borderRadius: "50% 50%" }} />
        </>
      )}
      <div className="absolute bottom-0 inset-x-0 h-px bg-black/10 z-10" />
      <div className={cn("relative mx-auto w-full max-w-4xl border-x border-black/10", verticalPaddings[verticalPadding], horizontalPaddings[horizontalPadding])}>
        {children}
      </div>
    </section>
  )
}