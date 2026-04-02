import { Footer } from '@/components/sections/footer'
import { Header } from '@/components/sections/header'
import { getFooterContent } from '@/content/footer'
import { getHeaderContent } from '@/content/header'
import type { Locale } from '@/i18n/routing'
import { baseUrl, routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono, Sora } from 'next/font/google'
import { notFound } from 'next/navigation'
import '../globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  return {
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
      canonical: `${baseUrl}/${locale}`,
      languages: {
        de: `${baseUrl}/de`,
        en: `${baseUrl}/en`,
        'x-default': `${baseUrl}/de`,
      },
    },
    openGraph: {
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      type: 'website',
      siteName: 'LW Works',
    },
  }
}

export default async function Layout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const headerContent = await getHeaderContent(locale as Locale)
  const footerContent = await getFooterContent(locale as Locale)

  return (
    <html lang={locale} className={cn(geist.variable, sora.variable, geistMono.variable, 'h-full antialiased', 'font-sans')} suppressHydrationWarning>
      <body className="min-h-full flex flex-col text-neutral-600 dark:text-neutral-400">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={{}}>
            <Header content={headerContent} />
            {children}
            <Footer content={footerContent} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
