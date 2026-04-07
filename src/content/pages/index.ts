import { AutomationPage, AutomationPageContent } from '@/components/pages/automation'
import { ContactPage, ContactPageContent } from '@/components/pages/contact'
import { DesignEngineeringPage, DesignEngineeringPageContent } from '@/components/pages/design-engineering'
import { DigitalDealerPage, type DigitalDealerPageContent } from '@/components/pages/digital-dealer'
import { PrivacyPage, PrivacyPageContent } from '@/components/pages/privacy'
import type { Locale } from '@/i18n/locale'
import type { Metadata } from 'next'
import { createElement, type ComponentType } from 'react'

export { pageSlugs, type PageKey, getPageKeyBySlug, getPageSlug } from './slugs'

type PageDefinition<C> = {
  component: ComponentType<{ content: C }>
  loader: Record<Locale, () => Promise<C>>
  render: (locale: Locale) => Promise<React.ReactNode>
  loadContent: (locale: Locale) => Promise<{ metadata: Metadata }>
}

function definePage<C extends { metadata: Metadata }>(
  component: ComponentType<{ content: C }>,
  loader: Record<Locale, () => Promise<C>>
): PageDefinition<C> {
  return {
    component,
    loader,
    render: async (locale) => {
      const content = await loader[locale]()
      return createElement(component, { content })
    },
    loadContent: (locale) => loader[locale]()
  }
}

export const pages = {
  'design-engineering': definePage<DesignEngineeringPageContent>(
    DesignEngineeringPage,
    {
      de: () => import('./design-engineering/de').then((m) => m.default),
      en: () => import('./design-engineering/en').then((m) => m.default)
    }
  ),
  automation: definePage<AutomationPageContent>(
    AutomationPage,
    {
      de: () => import('./automation/de').then((m) => m.default),
      en: () => import('./automation/en').then((m) => m.default)
    }
  ),
  'digital-dealer': definePage<DigitalDealerPageContent>(
    DigitalDealerPage,
    {
      de: () => import('./digital-dealer/de').then((m) => m.default),
      en: () => import('./digital-dealer/en').then((m) => m.default)
    }
  ),
  contact: definePage<ContactPageContent>(
    ContactPage,
    {
      de: () => import('./contact/de').then((m) => m.default),
      en: () => import('./contact/en').then((m) => m.default)
    }
  ),
  privacy: definePage<PrivacyPageContent>(
    PrivacyPage,
    {
      de: () => import('./privacy/de').then((m) => m.default),
      en: () => import('./privacy/en').then((m) => m.default)
    }
  )
}
