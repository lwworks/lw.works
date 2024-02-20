import {Heading} from '../atoms/heading'
import {Section} from '../layout/section'
import {Paragraph} from '../atoms/paragraph'
import {FC} from 'react'
import {Card} from '../atoms/card'
import {CheckIcon} from '../icons/check'
import {Button} from '../atoms/button'
import {Divider} from '../atoms/divider'
import {IconBox} from '../atoms/icon-box'
import {IconName} from '../icons'

type Content = {
  heading: string
  features: {icon: string; heading: string; text: string}[]
  prices: {
    badge?: string
    heading: string
    description: string
    pricePerMonth: number
    checklist: string[]
    cta: {caption: string; href: string}
    scarcity: {color: string; text: string}
  }[]
  call: {heading: string; text: string; cta: {caption: string; href: string}}
}

export const Pricing: FC<{content: Content}> = ({content}) => {
  return (
    <>
      <Section className="pt-24 lg:pt-48 pb-16 lg:pb-20">
        <Heading level={2} size="xl" className="lg:text-center mb-12 lg:mb-16" html={content.heading} />
        <div className="grid grid-cols-1 gap-12 lg:gap-x-16 md:grid-cols-2 lg:grid-cols-3">
          {content.features.map(({icon, heading, text}, index) => (
            <div key={index}>
              <div className="mb-4 flex flex-col gap-6 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row">
                <IconBox icon={icon as IconName} color="emerald" />
                <Heading level={3} size="sm" html={heading} />
              </div>
              <Paragraph className="max-w-md" html={text} />
            </div>
          ))}
        </div>
      </Section>
      <Divider />
      <Section id="pricing" className="pt-16 lg:pt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {content.prices.map(({badge, heading, description, pricePerMonth, checklist, cta, scarcity}, index) => (
          <div key={index} className="relative">
            {badge && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 shadow-lg h-5 text-xs uppercase tracking-wider bg-indigo-500 text-indigo-50 font-semibold rounded-full flex items-center px-2.5">
                {badge}
              </div>
            )}
            <Card className="group relative px-6 py-8 lg:p-12 flex flex-col justify-between items-start" borderAnimation={badge ? true : false}>
              {badge && (
                <div
                  className="absolute left-12 right-12 h-12 -top-6 blur-3xl bg-indigo-500 opacity-70 transition-opacity duration-300 group-hover:opacity-90"
                  style={{borderRadius: '50% 50%'}}
                />
              )}
              <div>
                <Heading level={3} size="lg" html={heading} />
                <Paragraph className="mt-3" html={description} />
                <div className="mb-4 mt-8 flex items-center sm:mb-0">
                  <div className="flex space-x-1 font-mono text-4xl text-black dark:text-white">
                    <span>€</span>
                    <span>{pricePerMonth}</span>
                  </div>
                  <div className="ml-3 mr-8 text-sm leading-[1.125] text-slate-500 dark:text-slate-400">
                    per
                    <br />
                    month
                  </div>
                </div>
                <ul className="space-y-2 my-8">
                  {checklist.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <CheckIcon
                        className={`h-3.5 mt-[0.3rem] shrink-0 ${badge ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-y-4 gap-x-6">
                <Button href={cta.href} secondary={badge ? false : true}>
                  {cta.caption}
                </Button>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <span
                    className={`block h-3 w-3 rounded-full p-[3px] animate-pulse ${
                      scarcity.color === 'emerald' ? 'bg-emerald-400/30' : 'bg-amber-400/30'
                    }`}
                  >
                    <span className={`block w-full h-full rounded-full ${scarcity.color === 'emerald' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  </span>
                  <span className="whitespace-nowrap">{scarcity.text}</span>
                </div>
              </div>
            </Card>
          </div>
        ))}
        <div className="md:col-span-2 lg:col-span-1 lg:py-12 lg:pl-3">
          <Heading level={2} html={content.call.heading} />
          <Paragraph className="my-7 max-w-lg" html={content.call.text} />
          <Button href={content.call.cta.href} secondary>
            {content.call.cta.caption}
          </Button>
        </div>
      </Section>
    </>
  )
}
