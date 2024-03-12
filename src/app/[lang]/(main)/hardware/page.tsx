import {Heading} from '@/components/atoms/heading'
import {Section} from '@/components/layout/section'
import {getDictionary} from '@/utils/get-dictionary'
import {Locale} from '@/i18n.config'
import {Metadata} from 'next'
import {getAllProducts} from '@/utils/shopify/get-all-products'
import {Paragraph} from '@/components/atoms/paragraph'
import {ProductPreview} from '@/components/hardware/product-preview'

export async function generateMetadata({params: {lang}}: {params: {lang: Locale}}): Promise<Metadata> {
  const dictionary = await getDictionary(lang)
  return dictionary.hardware.meta
}

export default async function Page({params: {lang}}: {params: {lang: Locale}}) {
  const dictionary = await getDictionary(lang)
  const {products} = await getAllProducts({lang})

  return (
    <main>
      <Section className="pt-32 lg:pt-48">
        <Heading level={1}>{dictionary.hardware.heading}</Heading>
        <Paragraph size="lg" className="mt-7 max-w-sm" html={dictionary.hardware.text} />
      </Section>
      <Section className="grid grid-cols-1 gap-12 py-24 sm:grid-cols-2 lg:grid-cols-3 lg:py-48">
        {products.map((product, index) => (
          <ProductPreview key={index} product={product} />
        ))}
      </Section>
    </main>
  )
}
