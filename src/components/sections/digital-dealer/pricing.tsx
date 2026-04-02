import { Brow } from "@/components/atoms/brow"
import { BrowStyleAccordion } from "@/components/atoms/brow-style-accordion"
import { Heading } from "@/components/atoms/heading"
import { Section } from "@/components/sections"
import { cn } from "@/lib/utils"
import { Check } from "@mynaui/icons-react"

export type DigitalDealerPricingSectionContent = {
  id: string
  title: string
  items: {
    brow: string
    title: string
    price: {
      original?: string
      now: string
      additional?: string
    }
    description: string
    features: string[]
    details?: {
      collapsedLabel: string
      expandedLabel: string
      items: {
        title: string
        description: string
        features: string[]
      }[]
    }
  }[]
}

export const DigitalDealerPricingSection = ({ content }: { content: DigitalDealerPricingSectionContent }) => {
  return (
    <Section id={content.id} verticalPadding="none" horizontalPadding="none">
      <h2 className="sr-only">{content.title}</h2>
      {content.items.map((item, index) => (
        <div key={index} className={cn("p-16", index > 0 && "border-t border-black/10")}>
          <div className="flex items-start justify-between gap-x-16">
            <div>
              <Brow variant="small" className={index === 0 ? "mb-2" : "mb-1"}>{item.brow}</Brow>
              <Heading as="h3" size={index === 0 ? "h2" : undefined}>{item.title}</Heading>
            </div>
            <div className="flex flex-col items-end whitespace-nowrap shrink-0 text-black font-mono">
              <span className="text-xl flex items-center gap-2">
                {item.price.original && (<span className="line-through text-base text-neutral-500">{item.price.original}</span>)}
                <span className={cn(item.price.original && "text-rose-500")}>{item.price.now}</span>
              </span>
              {item.price.additional && (<span className="text-sm">{item.price.additional}</span>)}
            </div>
          </div>
          <p className="mt-4">
            {item.description}
          </p>
          <ul className="mt-4 space-y-1">
            {item.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {item.details && (
            <BrowStyleAccordion collapsedLabel={item.details.collapsedLabel} expandedLabel={item.details.expandedLabel}>
              <div className="grid grid-cols-2 gap-x-16 gap-y-8">
                {item.details.items.map((item, index) => (
                  <div key={index}>
                    <Heading as="h4">{item.title}</Heading>
                    <p className="mt-4">{item.description}</p>
                    <ul className="mt-4 space-y-1">
                      {item.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="size-4 shrink-0 mt-1 text-indigo-600" strokeWidth={2} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </BrowStyleAccordion>
          )}
        </div>
      ))}
    </Section>
  )
}