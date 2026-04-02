import type {Locale} from '@/i18n/routing'
import type {ServicesContent} from '@/content/types'

const loaders: Record<Locale, () => Promise<ServicesContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default),
}

export const getServicesContent = (locale: Locale) => loaders[locale]()
