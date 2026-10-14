import { Main } from "@lw/ui/atoms/main"
import { Sidebar } from "@/components/molecules/sidebar"
import { Section } from "@/components/molecules/section"

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Main>
      <Section className="grow" verticalPadding="none" horizontalPadding="none">
        <Sidebar />
        {children}
      </Section>
    </Main>
  )
}