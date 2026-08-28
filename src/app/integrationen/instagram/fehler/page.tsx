import { InstagramErrorPage } from "@/components/pages/instagram/error";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Fehler bei der Instagram-Verknüpfung',
  description: '',
}

export default function Page() {
  return (
    <InstagramErrorPage />
  )
}