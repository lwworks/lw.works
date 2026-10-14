import { InstagramCancelledPage } from "@/components/pages/instagram/cancelled";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Instagram-Verknüpfung abgebrochen',
  description: '',
}

export default function Page() {
  return <InstagramCancelledPage />
}