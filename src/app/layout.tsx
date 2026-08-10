import { Footer } from '@/components/sections/footer'
import { Header } from '@/components/sections/header'
import { baseUrl } from '@/lib/site'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { BotIdClient } from 'botid/client'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const safiro = localFont({
  src: '../../public/fonts/Safiro-SemiBoldItalic.woff2',
  variable: '--font-safiro',
  weight: '600',
  style: 'italic',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: '%s | LW Works',
    default: 'LW Works',
  },
  icons: {
    icon: [
      { url: '/favicon/black.png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon/white.png', media: '(prefers-color-scheme: dark)' },
    ],
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    locale: 'de_DE',
    type: 'website',
    siteName: 'LW Works',
  },
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="de" className={cn(geist.variable, geistMono.variable, safiro.variable, 'h-full antialiased', 'font-sans')} suppressHydrationWarning>
      <head>
        <BotIdClient protect={[{ path: '/*', method: 'POST' }]} />
      </head>
      <body className="min-h-full flex flex-col text-neutral-600 dark:text-neutral-400">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
