import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Brow } from '../atoms/brow'
import { Heading } from '../atoms/heading'
import { Navigation } from '../atoms/navigation'
import { Card } from '../ui/card'

type HeroProps = {
  brow?: string
  title: string
  description: string
  withNav?: boolean
}

export const HeroSection = ({ brow, title, description, withNav = false }: HeroProps) => {
  return (
    <Card className={cn("relative w-full max-w-5xl mx-auto rounded-3xl gap-0 p-0", withNav && "mt-8")}>
      <Image src="/images/background-blob-light.jpg" alt="Background Blob" width={2336} height={642} className="absolute -left-32 top-0 w-[140%] max-w-none" />
      <div className={cn("relative p-16", withNav && "pt-4")}>
        {withNav && <Navigation />}
        {brow && <Brow as="span" className="mt-16">{brow}</Brow>}
        <Heading level={1} size="xl" className="mt-2">
          {title}
        </Heading>
      </div>
    </Card>
  )
}
