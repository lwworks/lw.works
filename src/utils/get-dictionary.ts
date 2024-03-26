import 'server-only'
import type {Locale} from '../i18n.config'

export const getDictionary = async (locale: Locale) => {
  const dictionaries = {
    en: () => import('../../dictionaries/en.json').then((module) => module.default),
    de: () => import('../../dictionaries/de.json').then((module) => module.default)
  }

  return dictionaries[locale]?.() ?? dictionaries.en()
}
