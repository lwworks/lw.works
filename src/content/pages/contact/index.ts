import {ContactPageContent} from '@/components/pages/contact'
import type {Locale} from '@/i18n/routing'

const loaders: Record<Locale, () => Promise<ContactPageContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default)
}

export const getContactPageContent = (locale: Locale) => loaders[locale]()
