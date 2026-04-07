import {PrivacyPageContent} from '@/components/pages/privacy'
import type {Locale} from '@/i18n/locale'

const loaders: Record<Locale, () => Promise<PrivacyPageContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default)
}

export const getPrivacyPageContent = (locale: Locale) => loaders[locale]()
