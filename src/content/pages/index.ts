import {AutomationPageContent} from '@/components/pages/automation'
import {ContactPageContent} from '@/components/pages/contact'
import {DesignEngineeringPageContent} from '@/components/pages/design-engineering'
import type {DigitalDealerPageContent} from '@/components/pages/digital-dealer'
import {HomePageContent} from '@/components/pages/home'
import {PrivacyPageContent} from '@/components/pages/privacy'
import type {Locale, PageKey} from '@/i18n/routing'

export type PageContentMap = {
  home: HomePageContent
  'design-engineering': DesignEngineeringPageContent
  automation: AutomationPageContent
  'digital-dealer': DigitalDealerPageContent
  contact: ContactPageContent
  privacy: PrivacyPageContent
}

type ContentLoaders = {
  [K in PageKey]: Record<Locale, () => Promise<PageContentMap[K]>>
}

const contentLoaders: ContentLoaders = {
  home: {
    de: () => import('./home/de').then((m) => m.default),
    en: () => import('./home/en').then((m) => m.default)
  },
  'design-engineering': {
    de: () => import('./design-engineering/de').then((m) => m.default),
    en: () => import('./design-engineering/en').then((m) => m.default)
  },
  automation: {
    de: () => import('./automation/de').then((m) => m.default),
    en: () => import('./automation/en').then((m) => m.default)
  },
  'digital-dealer': {
    de: () => import('./digital-dealer/de').then((m) => m.default),
    en: () => import('./digital-dealer/en').then((m) => m.default)
  },
  contact: {
    de: () => import('./contact/de').then((m) => m.default),
    en: () => import('./contact/en').then((m) => m.default)
  },
  privacy: {
    de: () => import('./privacy/de').then((m) => m.default),
    en: () => import('./privacy/en').then((m) => m.default)
  }
}

export const getPageContent = <K extends PageKey>(key: K, locale: Locale): Promise<PageContentMap[K]> => contentLoaders[key][locale]()
