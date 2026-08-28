import { ImpressumPage } from "@/components/pages/impressum";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Impressum',
  description: '',
}

export default function Page() {
  return <ImpressumPage />
}