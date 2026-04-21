'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getPathname, usePathname } from '@/i18n/navigation'
import { locales } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { Check, Globe } from '@mynaui/icons-react'
import { useLocale } from 'next-intl'

export type LangSwitcherContent = {
  de: string
  en: string
}

type DynamicPathname = Extract<ReturnType<typeof usePathname>, `${string}[${string}`>
type ParamValue = string | string[]
type RouteParams<Path extends string> = Path extends `${string}[[...${infer Param}]]${infer Rest}`
  ? { [K in Param]?: string[] } & RouteParams<Rest>
  : Path extends `${string}[...${infer Param}]${infer Rest}`
  ? { [K in Param]: string[] } & RouteParams<Rest>
  : Path extends `${string}[${infer Param}]${infer Rest}`
  ? { [K in Param]: string } & RouteParams<Rest>
  : {}

const segmentPattern = /^\[\[?\.\.\.(.+)\]\]$|^\[(.+)\]$/

const isDynamicPathname = (value: ReturnType<typeof usePathname>): value is DynamicPathname => {
  return value.includes('[')
}

const removeLocalePrefix = (path: string) => {
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) {
    return []
  }

  return locales.includes(segments[0] as (typeof locales)[number]) ? segments.slice(1) : segments
}

const buildParamsFromPath = <Path extends DynamicPathname>(
  template: Path,
  currentPath: string
): RouteParams<Path> => {
  const templateSegments = template.split('/').filter(Boolean)
  const pathSegments = removeLocalePrefix(currentPath)
  const params: Record<string, ParamValue> = {}

  let pathIndex = 0

  for (const templateSegment of templateSegments) {
    const match = segmentPattern.exec(templateSegment)

    if (!match) {
      pathIndex += 1
      continue
    }

    const catchAllKey = match[1]
    const singleKey = match[2]

    if (catchAllKey) {
      params[catchAllKey] = pathSegments.slice(pathIndex)
      break
    }

    if (singleKey) {
      const value = pathSegments[pathIndex]
      if (value) {
        params[singleKey] = value
      }
      pathIndex += 1
    }
  }

  return params as RouteParams<Path>
}

export const LangSwitcher = ({ content }: { content: LangSwitcherContent }) => {
  const locale = useLocale()
  const pathname = usePathname()

  const getLocalizedHref = (nextLocale: 'de' | 'en'): string => {
    if (isDynamicPathname(pathname)) {
      const currentPath = typeof window === 'undefined' ? '' : window.location.pathname
      const params = buildParamsFromPath(pathname, currentPath)
      return getPathname({ href: { pathname, params }, locale: nextLocale })
    }

    return getPathname({ href: pathname, locale: nextLocale })
  }

  return (
    <>
      <div className="sr-only">
        <a href={getLocalizedHref('de')} hrefLang="de">
          {content.de}
        </a>
        <a href={getLocalizedHref('en')} hrefLang="en">
          {content.en}
        </a>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-sm">
            <Globe strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem key="de" asChild>
            <a href={getLocalizedHref('de')} hrefLang="de">
              <Check className={cn('opacity-0', locale === 'de' && 'opacity-100')} />
              {content.de}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem key="en" asChild>
            <a href={getLocalizedHref('en')} hrefLang="en">
              <Check className={cn('opacity-0', locale === 'en' && 'opacity-100')} />
              {content.en}
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
