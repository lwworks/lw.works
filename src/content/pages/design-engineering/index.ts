import {DesignEngineeringPageContent} from '@/components/pages/design-engineering'
import type {Locale} from '@/i18n/locale'

const loaders: Record<Locale, () => Promise<DesignEngineeringPageContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default)
}

export const getDesignEngineeringPageContent = (locale: Locale) => loaders[locale]()
