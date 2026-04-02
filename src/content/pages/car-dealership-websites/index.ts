import type {Locale} from '@/i18n/routing'
import type {LandingPageContent} from '@/content/types'

const loaders: Record<Locale, () => Promise<LandingPageContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default),
}

export const getCarDealershipWebsitesContent = (locale: Locale) => loaders[locale]()
