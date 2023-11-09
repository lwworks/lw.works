import {Project as ProjectType} from 'contentlayer/generated'
import {FC} from 'react'
import {Section} from '../layout/section'
import {Heading} from '../atoms/heading'
import {MDX} from './mdx'
import Image from 'next/image'
import {Subheading} from '../atoms/subheading'
import {Divider} from '../atoms/divider'
import {ProjectHeading} from './headings'

export const Project: FC<{project: ProjectType; reverse?: boolean | false; hideDivider?: boolean | false}> = ({project, reverse, hideDivider}) => {
  return (
    <div id={project.slug} className="w-full overflow-y-hidden">
      {!hideDivider && <Divider />}
      <Section
        className={`group/container relative pt-16 lg:pt-24 flex flex-col gap-x-16 justify-between ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
      >
        <div className={`pointer-events-none absolute inset-0 flex flex-col justify-end ${reverse ? 'items-start' : 'items-end'}`}>
          <div
            className={`absolute -bottom-12 bg-indigo-400 w-1/2 h-32 blur-3xl sm:blur-4xl  transition-opacity duration-500 opacity-70 group-hover/container:opacity-100`}
            style={{borderRadius: '50% 50%'}}
          />
          <Image
            src="/images/background-grid.png"
            alt="Background Grid"
            width={1920}
            height={1080}
            className="relative w-full h-auto md:h-3/4 md:w-auto opacity-50 pointer-events-none"
          />
        </div>
        <div className="pt-9 pb-12">
          <Subheading>{project.tag}</Subheading>
          <ProjectHeading slug={project.slug}>{project.name}</ProjectHeading>
          <MDX code={project.body.code} />
        </div>
        <div className="relative w-full md:w-5/12 shrink-0 aspect-square">
          <Image src={project.image} alt={project.name} fill className="object-contain object-bottom" />
        </div>
      </Section>
    </div>
  )
}
