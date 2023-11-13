import {Heading} from '@/components/atoms/heading'
import {Paragraph} from '@/components/atoms/paragraph'
import {RemoveCartData} from '@/components/functional/remove-cart-data'
import {Section} from '@/components/layout/section'
import {Locale} from '@/i18n.config'
import {getDictionary} from '@/utils/get-dictionary'

export default async function Page({params: {lang}}: {params: {lang: Locale}}) {
  const dictionary = await getDictionary(lang)
  return (
    <main style={{minHeight: 'calc(100vh - 2rem)'}}>
      <RemoveCartData />
      <Section className="pt-32 pb-16 md:pt-40 md:pb-32 lg:pt-48">
        <Heading level={1} className="mb-12">
          {dictionary.hardware.thanks.heading}
        </Heading>
        {dictionary.hardware.thanks.paragraphs.map((text, index) => (
          <Paragraph key={index} size="lg" className="mt-4 max-w-sm" html={text}></Paragraph>
        ))}
      </Section>
    </main>
  )
}
