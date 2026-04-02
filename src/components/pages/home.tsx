import { Metadata } from "next"

export type HomePageContent = {
  metadata: Metadata
}

export const HomePage = ({ content }: { content: HomePageContent }) => {
  return (
    <main className="pt-16 py-96 mt-96 border-b border-black/10 text-center">
      {`${content.metadata.title!}`}
    </main>
  )
}