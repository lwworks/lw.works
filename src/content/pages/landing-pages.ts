import type {Locale, LandingPageKey} from '@/i18n/routing'
import type {LandingPageContent} from '@/content/types'

const contentLoaders: Record<LandingPageKey, Record<Locale, () => Promise<LandingPageContent>>> = {
  'car-dealership-websites': {
    de: () => import('./car-dealership-websites/de').then((m) => m.default),
    en: () => import('./car-dealership-websites/en').then((m) => m.default),
  },
}

export const getLandingPageContent = (key: LandingPageKey, locale: Locale) => contentLoaders[key][locale]()
