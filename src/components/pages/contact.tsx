import { ContactFormSection, ContactFormSectionContent } from "@/components/sections/contact/form"
import { Metadata } from "next"

export type ContactPageContent = {
  metadata: Metadata
  form: ContactFormSectionContent
}

export const ContactPage = ({ content }: { content: ContactPageContent }) => {
  return (
    <main className="pt-16">
      <ContactFormSection content={content.form} />
    </main>
  )
}
