'use client'
import {Prose} from '@/components/atoms/prose'
import * as Tabs from '@radix-ui/react-tabs'
import {FC, useState} from 'react'

const tabs = ['shipping', 'sizing', 'sustainability', 'transparency']

type Content = {
  shipping: string
  sizing: string
  sustainability: string
  transparency: string
}

export const ProductInfo: FC<{product: Product; content: Content}> = ({product, content}) => {
  const [tab, setTab] = useState<string>(tabs[0])
  return (
    <section className="mt-16">
      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List
          aria-label="Produktinformationen"
          className="relative z-10 mx-auto -mb-px flex w-full max-w-screen-xl space-x-4 overflow-x-auto px-6 pb-[0.8125rem] sm:px-8 lg:px-12"
        >
          {tabs.map((id) => {
            //@ts-ignore
            if (product[id])
              return (
                <Tabs.Trigger
                  key={id}
                  value={id}
                  className="relative flex h-9 shrink-0 cursor-pointer items-center rounded px-3 font-bold focus:bg-white/30 focus:outline-none data-[state=active]:text-black dark:focus:bg-white/10 dark:data-[state=active]:text-white md:h-7 md:px-2"
                >
                  {content[id as keyof Content]}
                  {tab === id && (
                    <div className="absolute inset-x-0 z-10 mt-[3.8rem] h-px overflow-y-hidden md:mt-[3.3rem]">
                      <div className="mx-auto -mt-6 h-12 w-2/3 opacity-80 blur" style={{backgroundColor: product.accentColor}} />
                    </div>
                  )}
                </Tabs.Trigger>
              )
          })}
        </Tabs.List>
        <div className="relative overflow-hidden border-t border-slate-200 pt-8 pb-20 dark:border-slate-700 sm:pb-28 md:pb-32 lg:pb-40 xl:pb-48">
          <div className="absolute inset-0">
            <div
              className="mx-auto -mt-48 h-96 w-full max-w-screen-xl bg-[#F9FAFB] blur-3xl dark:bg-[#15191F] sm:blur-4xl"
              style={{borderRadius: '50% 50%'}}
            />
          </div>
          {tabs.map((id) => (
            <Tabs.Content key={id} value={id} className="relative mx-auto w-full max-w-screen-xl px-6 sm:px-8 lg:px-12">
              {/* @ts-ignore */}
              <Prose html={product[id]} />
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
    </section>
  )
}
