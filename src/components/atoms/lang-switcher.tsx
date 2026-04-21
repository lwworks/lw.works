'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link, usePathname } from '@/i18n/navigation'
import { locales } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { Check, Globe } from '@mynaui/icons-react'
import { useLocale } from 'next-intl'
import { ComponentProps } from 'react'

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
  type LinkHref = ComponentProps<typeof Link>['href']

  const getLocalizedHref = (nextLocale: 'de' | 'en'): LinkHref => {
    if (isDynamicPathname(pathname)) {
      const params = buildParamsFromPath(pathname, window.location.pathname)
      return {
        pathname,
        params
      }
    }

    return pathname
  }

  return (
    <>
      <div className="sr-only">
        <Link href={getLocalizedHref('de')} locale="de">
          {content.de}
        </Link>
        <Link href={getLocalizedHref('en')} locale="en">
          {content.en}
        </Link>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-sm">
            <Globe strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem key="de" asChild>
            <Link href={getLocalizedHref('de')} locale="de">
              <Check className={cn('opacity-0', locale === 'de' && 'opacity-100')} />
              {content.de}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem key="en" asChild>
            <Link href={getLocalizedHref('en')} locale="en">
              <Check className={cn('opacity-0', locale === 'en' && 'opacity-100')} />
              {content.en}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
