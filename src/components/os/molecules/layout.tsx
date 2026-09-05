import { Main } from "@/components/main"
import { Sidebar } from "@/components/os/molecules/sidebar"
import { Section } from "@/components/sections"

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