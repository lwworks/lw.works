'use client'

import {FC, useEffect, useState} from 'react'
import {Icon} from '@/components/icons'
import {usePathname} from 'next/navigation'
import {getCookie, setCookie} from '@/app/actions'
import {AnimatePresence, motion, MotionConfig} from 'framer-motion'
import {FingerPrintIcon} from '@heroicons/react/24/solid'
import {Locale} from '@/i18n.config'

const dictionary = {
  de: {
    button: 'Cookies & Daten',
    heading: 'Cookies & Daten',
    text: "Für einige Funktionen unserer Website müssen in deinem Browser Cookies gespeichert werden, wofür wir deine Zustimmung brauchen. Mehr dazu in unserer <a class='text-rose-400' href='/de/datenschutz'>Datenschutzerklärung</a>.",
    showList: 'Details anzeigen',
    list: [
      '<span class="dark:text-black text-white">Consent</span> (essenziell): wir speichern die Auswahl, die du hier triffst.',
      '<span class="dark:text-black text-white">Theme</span> (essenziell): wir speichern, ob du den Dark- oder Light-Mode ausgewählt hast.',
      '<span class="dark:text-black text-white">Sprache</span> (essenziell): wir speichern, welche Sprache du ausgewählt hast.',
      '<span class="dark:text-black text-white">Stripe & Shopify</span> (essenziell): während der Zahlung verwenden die Dienstleister evtl. Cookies.',
      '<span class="dark:text-black text-white">Clarity</span> (nicht essenziell): das Analystetool hilft uns dabei, die Nutzung dieser Seite besser zu vestehen.'
    ],
    decline: 'Nur essenzielle Cookies zulassen',
    accept: 'Alles akzeptieren'
  },
  en: {
    button: 'Cookies & Data',
    heading: 'Cookies & Data',
    text: "For some functionalities of our website, we need to store cookies in your browser, for which we need your consent. Learn more in our <a class='text-rose-400' href=`/en/privacy`>Privacy Policy</a>.",
    showList: 'Show details',
    list: [
      '<span class="dark:text-black text-white">Consent</span> (essential): we store, what selection you make here.',
      '<span class="dark:text-black text-white">Theme</span> (essential): we store your selection, when you choose light oder dark mode.',
      '<span class="dark:text-black text-white">Language</span> (essential): we store your language selection.',
      '<span class="dark:text-black text-white">Stripe & Shopify</span> (essential): these service providers may use cookies during the payment process.',
      '<span class="dark:text-black text-white">Clarity</span> (non-essential): this tool helps us to better understand the use of this site.'
    ],
    decline: 'Accept Essential Cookies only',
    accept: 'Accept All'
  }
}

export const PrivacyButton: FC<{lang: Locale}> = ({lang}) => {
  const content = dictionary[lang]
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
  }, [pathname])

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
        aria-label={content.button}
        className="flex items-center justify-center size-8 rounded-full text-black hover:bg-black/10 dark:hover:bg-white/10 dark:text-white focus:bg-black/10 focus:outline-none dark:focus:bg-white/10"
      >
        <FingerPrintIcon className="size-5" />
      </button>
      <MotionConfig transition={{type: 'spring', duration: 0.4}}>
        <AnimatePresence>
          {showConsentBanner && (
            <motion.div
              initial={{y: '100%', opacity: 0}}
              animate={{y: 0, opacity: 1}}
              exit={{y: '100%', opacity: 0}}
              className="fixed inset-x-0 bottom-0 max-h-screen overflow-y-auto pb-8 z-50 bg-gradient-to-b from-white/0 to-white dark:from-[#0D0709]/0 dark:to-[#0D0709]"
            >
              <div className="mx-auto w-full max-w-2xl px-4">
                <div className="bg-black dark:bg-white rounded-3xl p-4 sm:p-6 shadow-lg">
                  <h2 className="text-lg drop-shadow-sm dark:drop-shadow-none text-white dark:text-black font-display font-extrabold leading-tight">
                    {content.heading}
                  </h2>
                  <p className="text-sm mt-2 leading-relaxed dark:text-neutral-500 text-neutral-300" dangerouslySetInnerHTML={{__html: content.text}} />
                  <details className="paragraph text-sm leading-relaxed dark:text-neutral-500 text-neutral-300 mt-2">
                    <summary className="cursor-pointer dark:text-black text-white flex items-center gap-1 focus:outline-none">
                      <span>{content.showList}</span>
                      <Icon name="chevron-down" className="h-2.5" />
                    </summary>
                    <ul className="list-disc mt-2 space-y-0.5 ml-6 marker:text-rose-400">
                      {content.list.map((text, index) => (
                        <li key={index}>
                          <span dangerouslySetInnerHTML={{__html: text}} />
                        </li>
                      ))}
                    </ul>
                  </details>
                  <div className="flex flex-wrap gap-2 mt-4 justify-end">
                    <button
                      onClick={() => updateConsent('necessary')}
                      className="h-8 bg-rose-400 whitespace-nowrap text-white hover:text-rose-50 px-3.5 rounded-xl shadow-md"
                    >
                      {content.decline}
                    </button>
                    <button
                      onClick={() => updateConsent('all')}
                      className="h-8 bg-rose-400 whitespace-nowrap text-white hover:text-rose-50 px-3.5 rounded-xl shadow-md"
                    >
                      {content.accept}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </>
  )
}
