import {HomePageContent} from '@/components/pages/home'
import type {Locale} from '@/i18n/locale'

const loaders: Record<Locale, () => Promise<HomePageContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default)
}

export const getHomePageContent = (locale: Locale) => loaders[locale]()
