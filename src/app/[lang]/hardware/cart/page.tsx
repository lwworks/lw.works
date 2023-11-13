import {Heading} from '@/components/atoms/heading'
import {Cart} from '@/components/hardware/cart'
import {Icon} from '@/components/icons'
import {Section} from '@/components/layout/section'
import {Locale} from '@/i18n.config'
import {getDictionary} from '@/utils/get-dictionary'
import Link from 'next/link'

export default async function Layout({params: {lang}, children}: {params: {lang: Locale}; children: React.ReactNode}) {
  const dictionary = await getDictionary(lang)

  return (
    <main style={{minHeight: 'calc(100vh - 2rem)'}}>
      <Section className="pt-32 pb-20 sm:pb-28 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40 xl:pb-48">
        <div className="mb-1 flex items-center space-x-4 font-mono uppercase text-black brightness-75 saturate-200 dark:text-white dark:brightness-100 dark:saturate-100 sm:mb-3">
          <Link
            href="/hardware"
            className="group -mx-1.5 flex items-center space-x-1 rounded-sm px-1.5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10"
          >
            <Icon name="arrow" className="mb-0.5 w-0 rotate-180 text-black opacity-20 transition-all duration-200 group-hover:w-4 dark:text-white" />
            <span className="text-indigo-500 dark:text-indigo-400">Hardware</span>
          </Link>
          <span className="text-black/20 dark:text-white/20">{'///'}</span>
        </div>
        <Heading level={1} className="pl-0.5">
          {dictionary.hardware.cart.heading}
        </Heading>
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <Cart content={dictionary.hardware.cart} />
        </div>
      </Section>
    </main>
  )
}
