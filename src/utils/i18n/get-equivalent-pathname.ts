import {i18n, Locale} from '@/i18n.config'

export const getEquivalentPathname = (pathname: string, locale: Locale) => {
  const equivalents = i18n.equivalents.find((e) =>
    // @ts-ignore
    Object.values(e).includes(i18n.locales.includes(pathname.split('/')[1]) ? pathname.replace(`/${pathname.split('/')[1]}`, '') : pathname)
  )
  return equivalents ? `/${locale}${equivalents[locale]}` : pathname
}
