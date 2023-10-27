import {getMetadata} from '@/utils/get-metadata'
import './globals.css'
import {Lato, Sora, JetBrains_Mono} from 'next/font/google'
import Script from 'next/script'
import {BlurBackground} from '@/components/visuals/blur-background'
import {Navigation} from '@/components/layout/navigation'
import {Footer} from '@/components/layout/footer'
import Analytics from '@/components/functional/analytics'

const lato = Lato({weight: ['400', '700'], subsets: ['latin'], display: 'swap', variable: '--font-lato'})
const sora = Sora({weight: '800', subsets: ['latin'], display: 'swap', variable: '--font-sora'})
const mono = JetBrains_Mono({weight: '300', subsets: ['latin'], display: 'swap', variable: '--font-mono'})

export const metadata = getMetadata({}).metadata

export default async function Layout({children}: {children: React.ReactNode}) {
  return (
    <html lang="de" className={`${lato.variable} ${sora.variable} ${mono.variable}`}>
      <head />
      <body>
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <Script
          id="check-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (!('theme' in localStorage)) localStorage.theme = 'system'
              if (localStorage.theme === 'dark' || (localStorage.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
            `
          }}
        />
        <BlurBackground />
        <Navigation />
        <div className="relative">{children}</div>
        <Footer />
      </body>
      <Analytics />
    </html>
  )
}
