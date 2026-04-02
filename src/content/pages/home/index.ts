import type {Locale} from '@/i18n/routing'
import type {HomeContent} from '@/content/types'

const loaders: Record<Locale, () => Promise<HomeContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default),
}

export const getHomeContent = (locale: Locale) => loaders[locale]()
