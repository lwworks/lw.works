import { Heading } from "@/components/atoms/heading"
import { Main } from "@/components/main"
import { Section } from "@/components/sections"
import { GoogleSignInButton } from "../google-sign-in-button"

export const LoginPage = () => {
  return (
    <Main>
      <Section background="paint-1" className="flex-0">
        <div className="flex flex-col gap-8 items-start">
          <Heading as="h1">Login</Heading>
          <p>LW Works OS — unser Operating System für interne Abläufe.</p>
          <GoogleSignInButton />
        </div>
      </Section>
      <Section className="grow" />
    </Main>
  )
}