import {getDictionary} from '../../utils/get-dictionary'
import {Hero} from '@/components/sections/hero'
import {LogoCloud} from '@/components/sections/logo-cloud'
import {PainPoints} from '@/components/sections/pain-points'
import {Process} from '@/components/sections/process'
import {Targets} from '@/components/sections/targets'
import {Trust} from '@/components/sections/trust'
import {Locale} from '@/i18n.config'
import {Projects} from '@/components/sections/projects'
import {Pricing} from '@/components/sections/pricing'
import {Testimonial} from '@/components/sections/testimonial'
import {FAQ} from '@/components/sections/faq'
import {CTA} from '@/components/sections/cta'
import {Design} from '@/components/sections/design'
import {Development} from '@/components/sections/development'

export default async function Page({params: {lang}}: {params: {lang: Locale}}) {
  const dictionary = await getDictionary(lang)

  return (
    <main>
      <Hero content={dictionary.index.hero} />
      <LogoCloud />
      <PainPoints content={dictionary.index.painPoints} />
      <Trust content={dictionary.index.trust} />
      <Targets content={dictionary.index.targets} />
      <Process content={dictionary.index.process} />
      <Design content={dictionary.index.design} />
      <Development content={dictionary.index.development} />
      <Projects content={dictionary.index.projects} language={lang} />
      <Testimonial content={dictionary.index.testimonial} />
      <Pricing content={dictionary.index.pricing} />
      <FAQ content={dictionary.index.faq} />
      <CTA content={dictionary.index.cta} />
    </main>
  )
}
