import { Metadata } from "next"

export type PrivacyPageContent = {
  metadata: Metadata
}

export const PrivacyPage = ({ content }: { content: PrivacyPageContent }) => {
  return (
    <main className="pt-16 py-96 mt-96 border-b border-black/10 text-center">
      {`${content.metadata.title!}`}
    </main>
  )
}