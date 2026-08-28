import { cn } from "@/lib/utils"
import Image from "next/image"

export const verticalPaddings = {
  small: "py-8 lg:py-16",
  default: "py-12 lg:py-24",
  large: "py-16 lg:py-32",
  none: "py-0",
}
export const horizontalPaddings = {
  default: "px-4 sm:px-8 lg:px-16",
  none: "px-0",
}

export type SectionVerticalPadding = keyof typeof verticalPaddings
export type SectionHorizontalPadding = keyof typeof horizontalPaddings
export type SectionBackground = "darker" | "paint-1" | "paint-2" | "paint-3" | "paint-4" | "stripes"

export type SectionProps = {
  id?: string
  verticalPadding?: SectionVerticalPadding
  horizontalPadding?: SectionHorizontalPadding
  bottomGradients?: "rose-orange" | "green-indigo" | "indigo-orange" | "teal-indigo"
  background?: SectionBackground
  children: React.ReactNode
  className?: string
}

export const Section = ({ id, verticalPadding = "default", horizontalPadding = "default", background, children, className }: SectionProps) => {
  return (
    <section id={id} className={cn("grow flex flex-col relative overflow-clip px-4 lg:px-0", className)}>
      <div className="absolute bottom-0 inset-x-0 h-px bg-black/10 dark:bg-white/10 z-10" />
      <div className={cn("relative mx-auto grow w-full max-w-4xl", (background === "darker" || background?.startsWith("paint-")) && "bg-neutral-50 dark:bg-[#0F0F0F]", verticalPaddings[verticalPadding], horizontalPaddings[horizontalPadding])}>
        {background === "stripes" && (<div className="absolute inset-0 bg-pattern-stripes" />)}
        {background === "paint-1" && (<>
          <Image src="/images/paint/paint-1-light.jpg" width={1728} height={1117} alt="Paint Background Light" className="dark:hidden absolute inset-x-0 bottom-0" loading="eager" />
          <Image src="/images/paint/paint-1-dark.jpg" width={1728} height={1117} alt="Paint Background Dark" className="hidden dark:block absolute inset-x-0 bottom-0" loading="eager" />
        </>)}
        {background === "paint-2" && (<>
          <Image src="/images/paint/paint-2-light.jpg" width={1728} height={1117} alt="Paint Background Light" className="dark:hidden absolute inset-x-0 bottom-0" loading="eager" />
          <Image src="/images/paint/paint-2-dark.jpg" width={1728} height={1117} alt="Paint Background Dark" className="hidden dark:block absolute inset-x-0 bottom-0" loading="eager" />
        </>)}
        {background === "paint-3" && (<>
          <Image src="/images/paint/paint-3-light.jpg" width={1728} height={1117} alt="Paint Background Light" className="dark:hidden absolute inset-x-0 top-0" loading="eager" />
          <Image src="/images/paint/paint-3-dark.jpg" width={1728} height={1117} alt="Paint Background Dark" className="hidden dark:block absolute inset-x-0 top-0" loading="eager" />
        </>)}
        {background === "paint-4" && (<>
          <Image src="/images/paint/paint-4-light.jpg" width={1728} height={1117} alt="Paint Background Light" className="dark:hidden absolute inset-x-0 top-0" loading="eager" />
          <Image src="/images/paint/paint-4-dark.jpg" width={1728} height={1117} alt="Paint Background Dark" className="hidden dark:block absolute inset-x-0 top-0" loading="eager" />
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