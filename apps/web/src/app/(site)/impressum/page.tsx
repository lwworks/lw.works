import { ImpressumPage } from "@/components/pages/impressum";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und rechtliche Angaben der LW Works GmbH — Sitz, Handelsregister, Geschäftsführung und Kontaktdaten.',
  alternates: {
    canonical: '/impressum',
  },
}

export default function Page() {
  return <ImpressumPage />
}