'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/navigation'
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
  const router = useRouter()
  const pathname = usePathname()

  const replaceLocale = (nextLocale: 'de' | 'en') => {
    if (isDynamicPathname(pathname)) {
      const params = buildParamsFromPath(pathname, window.location.pathname)
      router.replace(
        {
          pathname,
          params
        },
        { locale: nextLocale }
      )
      return
    }

    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <Globe strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          key="de"
          onClick={() => replaceLocale('de')}
        >
          <Check className={cn('opacity-0', locale === "de" && 'opacity-100')} />
          {content.de}
        </DropdownMenuItem>
        <DropdownMenuItem
          key="en"
          onClick={() => replaceLocale('en')}
        >
          <Check className={cn('opacity-0', locale === "en" && 'opacity-100')} />
          {content.en}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
