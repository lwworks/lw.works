import {Button} from '@/components/atoms/button'
import {Heading} from '@/components/atoms/heading'
import {Paragraph} from '@/components/atoms/paragraph'
import {Section} from '@/components/layout/section'

export const Home = () => {
  return (
    <main>
      <Section className="pt-32 pb-16 md:pt-40 md:pb-32 lg:pt-48">
        <Heading level={1} className="max-w-4xl">
          Präsentiere Dein SaaS Produkt
          <br className="hidden md:block" /> wie die Big Player
          <span className="mx-2 mb-2 inline-block h-1 w-12 bg-black dark:bg-white sm:mb-2.5 sm:h-1.5 sm:w-14 lg:mx-3 lg:mb-3 lg:h-2 lg:w-20" />
          <br className="hidden md:block" />
          ohne gleich ein Team einzustellen
        </Heading>
        <Paragraph className="my-12 max-w-xl">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
          voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
        </Paragraph>
        <div className="flex space-x-2">
          <Button>Primary Button</Button>
          <Button secondary>Secondary Button</Button>
        </div>
      </Section>
    </main>
  )
}

export default Home
