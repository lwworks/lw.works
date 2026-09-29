import { ReviewPage } from "@/components/pages/review";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Bewerte unsere Arbeit',
  description: 'Mit Deiner Bewertung hilfst Du uns, unsere Dienstleistung zu verbessern und möglichst viele weitere Unternehmen in ihre digitale Zukunft zu begleiten.',
}

export default function Page() {
  return (
    <ReviewPage />
  )
}