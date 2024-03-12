import {Navigation} from '@/components/layout/navigation'
import {Footer} from '@/components/layout/footer'
import {getDictionary} from '@/utils/get-dictionary'
import {Locale} from '@/i18n.config'

export default async function Layout({params: {lang}, children}: {params: {lang: Locale}; children: React.ReactNode}) {
  const dictionary = await getDictionary(lang)

  return (
    <>
      <Navigation content={dictionary.navigation} />
      <div className="relative">{children}</div>
      <Footer content={dictionary.footer} />
    </>
  )
}
