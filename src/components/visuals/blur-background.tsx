'use client'
import {BlobLarge} from '@/components/visuals/svg-blobs/blob-large'
import {Ellipse} from '@/components/visuals/svg-blobs/ellipse'
import {Triangle} from '@/components/visuals/svg-blobs/triangle'
import Image from 'next/image'

export const BlurBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 h-screen -left-32 -right-8 sm:inset-x-0">
        <Image src="/images/background-light.jpg" alt="Background" width="2000" height="1160" className="w-full h-auto dark:hidden" />
        <Image src="/images/background-dark.jpg" alt="Background" width="2000" height="1160" className="w-full h-auto hidden dark:block" />
        {/* <BlobLarge className="absolute -right-8 -top-8 w-1/2 text-[#AAACFF] blur-3xl dark:text-[#8182C8] md:-right-48 md:-top-40 md:blur-4xl" />
      <Ellipse className="absolute left-32 -top-4 w-7/12 rotate-6 text-[#DCBAFF] blur-3xl dark:text-[#AA8FC5] md:-top-32 md:left-auto md:right-16 md:blur-4xl" />
      <Ellipse className="absolute left-32 top-12 w-5/12 text-[#FFB800] mix-blend-overlay blur-2xl dark:text-[#A2B976] md:-top-8 md:left-1/4 md:blur-4xl" />
      <Triangle className="absolute -top-12 right-12 w-5/12 text-[#47FFAA] mix-blend-overlay blur-2xl dark:text-[#B0F4D5] md:-top-36 md:opacity-80 md:blur-4xl" /> */}
      </div>
    </div>
  )
}
