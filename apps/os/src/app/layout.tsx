import { Header } from '@/components/header'
import { getSession } from '@/lib/auth/get-session'
import { geist, geistMono, safiro } from '@/lib/fonts'
import { Toaster } from '@lw/ui/components/sonner'
import { cn } from '@lw/ui/lib/utils'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://os.lw.works'),
  title: {
    template: '%s — LW Works OS',
    default: 'LW Works OS',
  },
  icons: {
    icon: [
      { url: '/favicon/black.png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon/white.png', media: '(prefers-color-scheme: dark)' },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="de" className={cn(geist.variable, geistMono.variable, safiro.variable, 'h-full antialiased', 'font-sans')} suppressHydrationWarning>
      <body className="min-h-full flex flex-col text-neutral-600 dark:text-neutral-400">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header session={getSession()} />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
