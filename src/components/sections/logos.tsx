import { cn } from "@/lib/utils"
import Image from "next/image"
import { Section } from "."

const availableLogos = {
  airbus: {
    light: "/images/logos/airbus-black.svg",
    dark: "/images/logos/airbus-white.svg",
    alt: "Airbus",
    width: 346,
    height: 64,
    heightClass: "h-4",
  },
  amazon: {
    light: "/images/logos/amazon-black.svg",
    dark: "/images/logos/amazon-white.svg",
    alt: "Amazon",
    width: 318,
    height: 96,
    heightClass: "h-6",
  },
  bmw: {
    light: "/images/logos/bmw-black.svg",
    dark: "/images/logos/bmw-white.svg",
    alt: "BMW",
    width: 128,
    height: 128,
    heightClass: "size-12",
  },
  brunkhorst: {
    light: "/images/logos/brunkhorst-black.svg",
    dark: "/images/logos/brunkhorst-white.svg",
    alt: "Brunkhorst",
    width: 523,
    height: 64,
    heightClass: "h-6",
  },
  effect: {
    light: "/images/logos/effect-black.svg",
    dark: "/images/logos/effect-white.svg",
    alt: "Effect.ts",
    width: 323,
    height: 96,
    heightClass: "h-6",
  },
  lehmann: {
    light: "/images/logos/lehmann-black.svg",
    dark: "/images/logos/lehmann-white.svg",
    alt: "Lehmann Rollstuhlrampen & Hebelifte",
    width: 228,
    height: 96,
    heightClass: "h-8",
  },
  livestore: {
    light: "/images/logos/livestore-black.svg",
    dark: "/images/logos/livestore-white.svg",
    alt: "Livestore",
    width: 408,
    height: 96,
    heightClass: "h-7",
  },
  porsche: {
    light: "/images/logos/porsche-black.svg",
    dark: "/images/logos/porsche-white.svg",
    alt: "Porsche",
    width: 448,
    height: 30,
    heightClass: "h-3",
  },
  scoo: {
    light: "/images/logos/scoo-black.svg",
    dark: "/images/logos/scoo-white.svg",
    alt: "Scoo Kombucha",
    width: 326,
    height: 80,
    heightClass: "h-6",
  },
  urlbox: {
    light: "/images/logos/urlbox-black.svg",
    dark: "/images/logos/urlbox-white.svg",
    alt: "Urlbox",
    width: 330,
    height: 80,
    heightClass: "h-6",
  },
} as const

export type Logo = keyof typeof availableLogos

const logoImageClassName = "w-auto opacity-50 transition-opacity hover:opacity-100"

const LogoImage = ({ name, className }: { name: Logo; className?: string }) => {
  const logo = availableLogos[name]

  return (
    <>
      <Image
        src={logo.light}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={cn(logoImageClassName, logo.heightClass, "dark:hidden", className)}
      />
      <Image
        src={logo.dark}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={cn(logoImageClassName, logo.heightClass, "hidden dark:block", className)}
      />
    </>
  )
}

const LogoTrack = ({
  logos,
  className,
  ...props
}: {
  logos: Logo[]
  className?: string
} & React.ComponentProps<"div">) => (
  <div className={cn("flex shrink-0 items-center gap-12 px-6", className)} {...props}>
    {logos.map((key) => (
      <LogoImage key={key} name={key} />
    ))}
  </div>
)

interface LogosSectionProps {
  logos: Logo[]
  variant: "default" | "carousel"
}

export const LogosSection = ({ logos, variant = "default" }: LogosSectionProps) => {
  if (variant === "carousel") {
    const marqueeDuration = `${logos.length * 6}s`

    return (
      <Section verticalPadding="none" horizontalPadding="none">
        <div className="overflow-hidden py-8">
          <div
            className="flex w-max animate-logo-marquee motion-reduce:animate-none hover:paused"
            style={{ "--logo-marquee-duration": marqueeDuration } as React.CSSProperties}
          >
            <LogoTrack logos={logos} />
            <LogoTrack logos={logos} aria-hidden />
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section verticalPadding="small" horizontalPadding="default">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
        {logos.map((key) => (
          <LogoImage key={key} name={key} />
        ))}
      </div>
    </Section>
  )
}
