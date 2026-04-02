import type {DigitalDealerPageContent} from '@/components/pages/digital-dealer'
import type {Locale} from '@/i18n/routing'

const loaders: Record<Locale, () => Promise<DigitalDealerPageContent>> = {
  de: () => import('./de').then((m) => m.default),
  en: () => import('./en').then((m) => m.default)
}

export const getDigitalDealerPageContent = (locale: Locale) => loaders[locale]()
