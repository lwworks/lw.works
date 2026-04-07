import {AutomationPageContent} from '@/components/pages/automation'
import type {Locale} from '@/i18n/locale'

const loaders: Record<Locale, () => Promise<AutomationPageContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default)
}

export const getAutomationPageContent = (locale: Locale) => loaders[locale]()
