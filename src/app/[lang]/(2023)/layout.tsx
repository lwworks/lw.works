import './globals.css'
import {Metadata} from 'next'
import {Lato, Sora, JetBrains_Mono} from 'next/font/google'
import {BlurBackground} from '@/components/visuals/blur-background'
import {Footer} from '@/components/layout/footer'
import {getDictionary} from '@/utils/get-dictionary'
import {Locale} from '@/i18n.config'
import Fathom from '@/components/functional/fathom'
import {ThemeProvider} from '@/components/functional/theme-provider'

const lato = Lato({weight: ['400', '700'], subsets: ['latin'], display: 'swap', variable: '--font-lato'})
const sora = Sora({weight: '800', subsets: ['latin'], display: 'swap', variable: '--font-sora'})
const mono = JetBrains_Mono({weight: '300', subsets: ['latin'], display: 'swap', variable: '--font-mono'})

export async function generateMetadata({params: {lang}}: {params: {lang: Locale}}): Promise<Metadata> {
  const dictionary = await getDictionary(lang)
  return {
    ...dictionary.index.meta,
    icons: {
      icon: [
        {
          url: '/favicon-black.ico',
          media: '(prefers-color-scheme: light)'
        },
        {
          url: '/favicon-white.ico',
          media: '(prefers-color-scheme: dark)'
        }
      ]
    }
  }
}

export default async function Layout({params: {lang}, children}: {params: {lang: Locale}; children: React.ReactNode}) {
  const dictionary = await getDictionary(lang)

  return (
    <html lang={lang} className={`relative ${lato.variable} ${sora.variable} ${mono.variable}`} suppressHydrationWarning>
      <head />
      <body className="relative overflow-x-hidden">
        <ThemeProvider>
          <BlurBackground />
          {children}
          <Footer content={dictionary.footer} />
        </ThemeProvider>
      </body>
      <Fathom />
    </html>
  )
}
