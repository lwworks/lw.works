import { cn } from '@/lib/utils'
import { Minus, Plus } from '@mynaui/icons-react'
import { Accordion } from 'radix-ui'

type BrowStyleAccordionProps = {
  collapsedLabel: string
  expandedLabel: string
  children: React.ReactNode
  className?: string
}

export const BrowStyleAccordion = ({ collapsedLabel, expandedLabel, children, className }: BrowStyleAccordionProps) => {
  return (
    <Accordion.Root type="single" collapsible className={cn("mt-8", className)}>
      <Accordion.Item value="details" className="-mr-16">
        <Accordion.Trigger className="group flex w-full items-center gap-2 hover:text-black cursor-pointer">
          <div className="relative size-4">
            <Plus className="absolute size-4 shrink-0 text-indigo-600 group-aria-expanded:-rotate-180 group-aria-expanded:opacity-0 transition duration-300" strokeWidth={2} />
            <Minus className="absolute size-4 shrink-0 text-indigo-600 opacity-0 group-aria-expanded:-rotate-180 group-aria-expanded:opacity-100 transition duration-300" strokeWidth={2} />
          </div>
          <span className="group-aria-expanded:hidden">{collapsedLabel}</span>
          <span className="hidden group-aria-expanded:inline">{expandedLabel}</span>
          <div className="flex-1 flex items-center">
            <span className="size-1 shrink-0 bg-indigo-500" />
            <span className="h-px flex-1 bg-linear-to-l from-black/10 via-black/10 to-indigo-500/50" />
          </div>
        </Accordion.Trigger>
        <Accordion.Content className="pt-8 pr-16 text-sm">
          {children}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}