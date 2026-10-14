import { InstagramPage } from "@/components/pages/instagram"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Instagram-Account verknüpfen',
  description: '',
}

export default function Page() {
  return <InstagramPage />
}