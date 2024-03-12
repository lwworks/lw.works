'use client'

import {FC, useEffect, useState} from 'react'
import {Icon} from '../icons'
import {Card} from '../atoms/card'
import {Heading} from '../atoms/heading'
import {Paragraph} from '../atoms/paragraph'
import {Button} from '../atoms/button'
import {usePathname} from 'next/navigation'
import {getCookie, setCookie} from '@/app/actions'
import {AnimatePresence, motion} from 'framer-motion'

export type Content = {
  button: string
  heading: string
  text: string
  showList: string
  list: string[]
  decline: string
  accept: string
}

export const CookieConsent: FC<{content: Content}> = ({content}) => {
  const pathname = usePathname()
  const [showConsentBanner, setShowConsentBanner] = useState<boolean>(false)
  const [consent, setConsent] = useState<undefined | 'necessary' | 'all'>(undefined)

  const updateConsent = async (consent: 'necessary' | 'all') => {
    setShowConsentBanner(false)
    setConsent(consent)
    await setCookie('consent', consent)
    location.reload()
  }

  useEffect(() => {
    const checkCookie = async () => {
      const cookie = await getCookie('consent')
      if (!cookie) setShowConsentBanner(true)
      else {
        setShowConsentBanner(false)
        setConsent(localStorage.consent)
      }
    }
    checkCookie()
  }, [content, pathname])

  useEffect(() => {
    if (consent === 'all') {
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.textContent = `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "jo8njmj2sk");`
      document.head.appendChild(script)
    }
  }, [consent])

  return (
    <>
      <Button action={() => setShowConsentBanner(true)} secondary hideArrow>
        <div className="flex gap-2 items-center text-base">
          <Icon name="fingerprint" className="h-4" />
          <span>{content.button}</span>
        </div>
      </Button>
      <AnimatePresence>
        {showConsentBanner && (
          <motion.div
            initial={{y: '100%'}}
            animate={{y: 0}}
            exit={{y: '100%'}}
            className="fixed inset-x-0 bottom-0 max-h-screen overflow-y-auto py-6 sm:py-8 lg:py-12 z-50 bg-gradient-to-b from-white/0 to-white dark:from-[#0E1117]/0 dark:to-[#0E1117]"
          >
            <div className="mx-auto w-full max-w-screen-xl px-6 sm:px-8 lg:px-12">
              <Card className="p-6 sm:p-8 flex flex-col gap-8 md:flex-row md:gap-12" borderAnimation>
                <div className="shrink-0">
                  <Heading level={2} html={content.heading} />
                </div>
                <div className="shrink grow">
                  <Paragraph className="text-sm max-w-xl" html={content.text} />
                  <details className="paragraph text-sm leading-relaxed text-slate-600 dark:text-slate-300 mt-2">
                    <summary className="cursor-pointer text-black dark:text-white font-semibold flex items-center gap-2">
                      <span>{content.showList}</span>
                      <Icon name="chevron-down" className="h-3" />
                    </summary>
                    <ul className="list-disc mt-2 space-y-0.5 ml-6">
                      {content.list.map((text, index) => (
                        <li key={index}>
                          <span dangerouslySetInnerHTML={{__html: text}} />
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
                <div className="shrink-0 flex flex-col gap-2 items-start md:items-end">
                  <Button secondary hideArrow action={() => updateConsent('necessary')}>
                    {content.decline}
                  </Button>
                  <Button action={() => updateConsent('all')}>{content.accept}</Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
