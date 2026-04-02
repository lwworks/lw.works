import { Metadata } from "next"

export type ContactPageContent = {
  metadata: Metadata
}

export const ContactPage = ({ content }: { content: ContactPageContent }) => {
  return (
    <main className="pt-16 py-96 mt-96 border-b border-black/10 text-center">
      {`${content.metadata.title!}`}
    </main>
  )
}