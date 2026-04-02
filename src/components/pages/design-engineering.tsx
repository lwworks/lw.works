import { Metadata } from "next"

export type DesignEngineeringPageContent = {
  metadata: Metadata
}

export const DesignEngineeringPage = ({ content }: { content: DesignEngineeringPageContent }) => {
  return (
    <main className="pt-16 py-96 mt-96 border-b border-black/10 text-center">
      {`${content.metadata.title!}`}
    </main>
  )
}