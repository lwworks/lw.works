import { geist, geistMono, safiro } from '@/lib/fonts'
import { baseUrl } from '@/lib/site'
import { cn } from '@lw/ui/lib/utils'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next'
import { BotIdClient } from 'botid/client'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: '%s — LW Works GmbH',
    default: 'LW Works GmbH',
  },
  icons: {
    icon: [
      { url: '/favicon/black.png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon/white.png', media: '(prefers-color-scheme: dark)' },
    ],
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
        <BotIdClient
          protect={[
            { path: '/check', method: 'POST' },
            { path: '/bni', method: 'POST' },
            { path: '/team/*', method: 'POST' },
            { path: '/api/booking/*', method: 'POST' },
          ]}
        />
      </head>
      <body className="min-h-full flex flex-col text-neutral-600 dark:text-neutral-400">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
