import type {FooterContent} from '@/components/sections/footer'
import type {Locale} from '@/i18n/routing'

const loaders: Record<Locale, () => Promise<FooterContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default)
}

export const getFooterContent = (locale: Locale) => loaders[locale]()
