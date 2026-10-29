import { cn } from "@lw/ui/lib/utils"
import Image from "next/image"

const verticalPaddings = {
  default: "py-12 lg:py-24",
  none: "py-0",
}
const horizontalPaddings = {
  default: "px-4 sm:px-8 lg:px-16",
  none: "px-0",
}

export type SectionProps = {
  verticalPadding?: keyof typeof verticalPaddings
  horizontalPadding?: keyof typeof horizontalPaddings
  background?: "paint-1"
  children?: React.ReactNode
  className?: string
}

export const Section = ({ verticalPadding = "default", horizontalPadding = "default", background, children, className }: SectionProps) => {
  return (
    <section className={cn("grow flex flex-col relative overflow-clip px-4 lg:px-0", className)}>
      <div className="absolute bottom-0 inset-x-0 h-px bg-black/10 dark:bg-white/10 z-10" />
      <div className={cn("relative mx-auto grow w-full max-w-4xl", background && "bg-neutral-50 dark:bg-[#0F0F0F]", verticalPaddings[verticalPadding], horizontalPaddings[horizontalPadding])}>
        {background === "paint-1" && (<>
          {/* Lazy: browsers skip lazy images that are `display: none`, so only the active theme's variant downloads. */}
          <Image src="/images/paint/paint-1-light.jpg" width={1728} height={1117} sizes="(min-width: 896px) 896px, 100vw" alt="Paint Background Light" className="dark:hidden absolute inset-x-0 bottom-0" />
          <Image src="/images/paint/paint-1-dark.jpg" width={1728} height={1117} sizes="(min-width: 896px) 896px, 100vw" alt="Paint Background Dark" className="hidden dark:block absolute inset-x-0 bottom-0" />
        </>)}
        <div className="absolute top-0 right-0 bottom-px w-px bg-black/10 dark:bg-white/10 z-20 pointer-events-none" />
        <div className="absolute top-0 left-0 bottom-px w-px bg-black/10 dark:bg-white/10 z-20 pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </section>
  )
}
