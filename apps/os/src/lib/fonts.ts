import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const safiro = localFont({
  src: '../../../../packages/ui/src/fonts/safiro-semibold-italic.woff2',
  variable: '--font-safiro',
  weight: '600',
  style: 'italic',
  display: 'swap',
})
