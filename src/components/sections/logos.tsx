import { Section } from ".";

const availableLogos = {
  airbus: {
    light: "/images/logos/airbus-black.svg",
    dark: "/images/logos/airbus-white.svg",
  },
  amazon: {
    light: "/images/logos/amazon-black.svg",
    dark: "/images/logos/amazon-white.svg",
  },
  bmw: {
    light: "/images/logos/bmw-black.svg",
    dark: "/images/logos/bmw-white.svg",
  },
  effect: {
    light: "/images/logos/effect-black.svg",
    dark: "/images/logos/effect-white.svg",
  },
  lehmann: {
    light: "/images/logos/lehmann-black.svg",
    dark: "/images/logos/lehmann-white.svg",
  },
  porsche: {
    light: "/images/logos/porsche-black.svg",
    dark: "/images/logos/porsche-white.svg",
  },
  scoo: {
    light: "/images/logos/scoo-black.svg",
    dark: "/images/logos/scoo-white.svg",
  },
  urlbox: {
    light: "/images/logos/urlbox-black.svg",
    dark: "/images/logos/urlbox-white.svg",
  },
}

export type Logo = keyof typeof availableLogos;

interface LogosSectionProps {
  logos: Logo[];
  variant: "default" | "carousel";
}

export const LogosSection = ({ logos, variant }: LogosSectionProps) => {
  return (
    <Section verticalPadding="none" horizontalPadding="none">

    </Section>
  )
}