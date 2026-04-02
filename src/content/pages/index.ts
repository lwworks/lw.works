import type {DigitalDealerPageContent} from '@/components/pages/digital-dealer'
import type {Locale, PageKey} from '@/i18n/routing'

export type PageContentMap = {
  'digital-dealer': DigitalDealerPageContent
}

type ContentLoaders = {
  [K in PageKey]: Record<Locale, () => Promise<PageContentMap[K]>>
}

const contentLoaders: ContentLoaders = {
  'digital-dealer': {
    de: () => import('./digital-dealer/de').then((m) => m.default),
    en: () => import('./digital-dealer/en').then((m) => m.default)
  }
}

export const getPageContent = <K extends PageKey>(key: K, locale: Locale): Promise<PageContentMap[K]> => contentLoaders[key][locale]()
