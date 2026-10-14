import { BniPage } from "@/components/pages/bni";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'BNI Vier-Augen-Gespräch mit Lukas Brunkhorst',
  description: 'Lass uns netzwerken! Als BNI-Mitglied kannst Du Dir ganz einfach ein Vier-Augen-Gespräch einbuchen.',
}

export default function Page() {
  return (
    <BniPage />
  )
}