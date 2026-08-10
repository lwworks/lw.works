import { cn } from "@/lib/utils"
import Image from "next/image"

type SectionProps = {
  id?: string
  verticalPadding?: "small" | "default" | "large" | "none"
  horizontalPadding?: "default" | "none"
  bottomGradients?: "rose-orange" | "green-indigo" | "indigo-orange" | "teal-indigo"
  background?: "1"
  children: React.ReactNode
  className?: string
}

export const Section = ({ id, verticalPadding = "default", horizontalPadding = "default", background, children, className }: SectionProps) => {
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
      <div className="absolute bottom-0 inset-x-0 h-px bg-black/10 dark:bg-white/10 z-10" />
      <div className={cn("relative mx-auto w-full max-w-4xl", verticalPaddings[verticalPadding], horizontalPaddings[horizontalPadding])}>
        {background === "1" && (<>
          <Image src="/images/hero/hero-1-light.jpg" width={1728} height={1117} alt="Hero Background Light" className="dark:hidden absolute inset-x-0 bottom-0" loading="eager" />
          <Image src="/images/hero/hero-1-dark.jpg" width={1728} height={1117} alt="Hero Background Dark" className="hidden dark:block absolute inset-x-0 bottom-0" loading="eager" />
        </>)}
        <div className="absolute top-0 right-0 bottom-px w-px bg-black/10 dark:bg-white/10" />
        <div className="absolute top-0 left-0 bottom-px w-px bg-black/10 dark:bg-white/10" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </section>
  )
}