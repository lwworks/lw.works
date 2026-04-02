import type {HeaderContent} from '@/components/sections/header'
import type {Locale} from '@/i18n/routing'

const loaders: Record<Locale, () => Promise<HeaderContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default),
}

export const getHeaderContent = (locale: Locale) => loaders[locale]()
