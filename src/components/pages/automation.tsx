import { Metadata } from "next"

export type AutomationPageContent = {
  metadata: Metadata
}

export const AutomationPage = ({ content }: { content: AutomationPageContent }) => {
  return (
    <main className="pt-16 py-96 mt-96 border-b border-black/10 text-center">
      {`${content.metadata.title!}`}
    </main>
  )
}