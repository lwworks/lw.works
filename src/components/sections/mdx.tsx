import { flattenToc } from '@/lib/mdx/flatten-toc'
import { cn } from '@/lib/utils'
import type { MdxTocEntry, MdxTocItem } from '@/types/mdx-toc'
import type { ComponentType } from 'react'
import { Section } from '.'
import { Link } from '../link'

type MDXSectionProps = {
  content: ComponentType
  toc?: MdxTocEntry[]
  className?: string
}

const TOC = ({ items }: { items: MdxTocItem[] }) => {
  return (
    <nav aria-label="Inhaltsverzeichnis" className="text-sm">
      <p className="mb-4 font-medium text-black dark:text-white">Inhalt</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(item.depth === 3 && 'pl-4')}
          >
            <Link
              href={`#${item.id}`}
              className="hover:text-black dark:hover:text-white"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export const MDXSection = ({ content: Content, toc, className }: MDXSectionProps) => {
  const tocItems = toc ? flattenToc(toc) : []

  return (
    <Section verticalPadding="none">
      <div className={cn(
        'pt-16 pb-24',
        'prose prose-neutral max-w-none dark:prose-invert',
        'prose-headings:font-heading prose-headings:font-black prose-headings:text-black dark:prose-headings:text-white',
        'prose-h2:mt-10 prose-h2:scroll-mt-24 prose-h2:text-3xl prose-h2:first:mt-0',
        'prose-h3:mt-8 prose-h3:scroll-mt-24 prose-h3:text-xl',
        'prose-p:text-neutral-600 dark:prose-p:text-neutral-400',
        'prose-strong:font-medium prose-strong:text-black dark:prose-strong:text-white',
        'prose-a:text-black prose-a:underline dark:prose-a:text-white prose-a:hover:opacity-80',
        className
      )}>
        <Content />
      </div>
      {toc && tocItems.length > 0 && (
        <div className="hidden 2xl:block absolute w-80 -right-96 top-0 border-r border-black/10 dark:border-white/10 p-16 h-[calc(100vh-64px)]">
          <TOC
            items={tocItems}
          />
        </div>
      )}
    </Section>
  )
}
