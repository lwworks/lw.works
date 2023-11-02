import {Features} from '@/components/sections/features'
import {getDictionary} from '../../utils/get-dictionary'
import {Hero} from '@/components/sections/hero'
import {LogoCloud} from '@/components/sections/logo-cloud'
import {PainPoints} from '@/components/sections/pain-points'
import {Process} from '@/components/sections/process'
import {Targets} from '@/components/sections/targets'
import {Trust} from '@/components/sections/trust'
import {Locale} from '@/i18n.config'

export default async function Page({params: {lang}}: {params: {lang: Locale}}) {
  const dictionary = await getDictionary(lang)

  return (
    <main>
      <Hero content={dictionary.hero} />
      <LogoCloud />
      <PainPoints content={dictionary.painPoints} />
      <Trust content={dictionary.trust} />
      <Targets content={dictionary.targets} />
      <Process content={dictionary.process} />
      <Features />
      <div className="h-96" />
    </main>
  )
}
