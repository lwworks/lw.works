'use client'

import Script from 'next/script'
import {FC, Fragment, useEffect, useState} from 'react'
import {Icon} from '../icons'
import {Card} from '../atoms/card'
import {Heading} from '../atoms/heading'
import {Paragraph} from '../atoms/paragraph'
import {Button} from '../atoms/button'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

export type Content = {
  excludedPaths: string[]
  button: string
  heading: string
  text: string
  showList: string
  list: {text: string; tag: string}[]
  decline: string
  accept: string
  links: {caption: string; href: string}[]
}

export const CookieConsent: FC<{content: Content}> = ({content}) => {
  const pathname = usePathname()
  const [showConsentBanner, setShowConsentBanner] = useState<boolean>(false)
  const [consent, setConsent] = useState<undefined | 'necessary' | 'all'>(undefined)

  useEffect(() => {
    if (!('consent' in localStorage) && !content.excludedPaths.includes(pathname)) {
      setShowConsentBanner(true)
    } else {
      setShowConsentBanner(false)
      setConsent(localStorage.consent)
    }
  }, [content, pathname])

  useEffect(() => {
    if (showConsentBanner) document.body.classList.add('no-scroll')
    else document.body.classList.remove('no-scroll')
  }, [showConsentBanner])

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
      <button
        onClick={() => setShowConsentBanner(true)}
        className="mt-4 flex items-center gap-2 sm:text-base text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
      >
        <Icon name="fingerprint" className="h-4" />
        <span>{content.button}</span>
      </button>
      {showConsentBanner && (
        <div className="fixed top-0 left-0 h-screen w-screen overflow-y-auto py-16 sm:py-24 lg:py-48 bg-white/50 dark:bg-[#0E1117]/50 backdrop-blur z-50">
          <div className="w-full max-w-2xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-xl">
              <Card className="px-6 py-8 lg:p-12" borderAnimation>
                <Heading level={2} html={content.heading} />
                <Paragraph className="mt-7" html={content.text} />
                <details className="paragraph text-base leading-relaxed text-slate-600 dark:text-slate-300 mt-4">
                  <summary className="cursor-pointer text-black dark:text-white font-semibold flex items-center gap-2">
                    <span>{content.showList}</span>
                    <Icon name="chevron-down" className="h-3" />
                  </summary>
                  <ul className="list-disc mt-4 space-y-2 ml-6">
                    {content.list.map(({text, tag}, index) => (
                      <li key={index}>
                        <span dangerouslySetInnerHTML={{__html: text}} />
                        <span className="inline-block rounded-full px-1.5 text-xs ml-1.5 mt-1.5 absolute h-4 bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
                <div className="mt-8 flex flex-wrap gap-2">
                  <Button
                    secondary
                    hideArrow
                    action={() => {
                      setShowConsentBanner(false)
                      setConsent('necessary')
                      localStorage.setItem('consent', 'necessary')
                      location.reload()
                    }}
                  >
                    {content.decline}
                  </Button>
                  <Button
                    action={() => {
                      setShowConsentBanner(false)
                      setConsent('all')
                      localStorage.setItem('consent', 'all')
                      location.reload()
                    }}
                  >
                    {content.accept}
                  </Button>
                </div>
                <div className="mt-8">
                  {content.links.map(({caption, href}, index) => (
                    <Fragment key={index}>
                      {index > 0 && <span className="mx-2">|</span>}
                      <Link href={href} className="hover:text-slate-500 dark:hover:text-slate-400">
                        {caption}
                      </Link>
                    </Fragment>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
