import {FC} from 'react'
import NextImage from 'next/image'

export const Image: FC<{src: string; alt: string; width: number; height: number}> = ({src, alt, width, height}) => {
  return (
    <div className="relative">
      <figure className="xl:-mx-8">
        <NextImage src={src} alt={alt} width={width} height={height} className="" />
        <figcaption className="font-mono text-xs xl:pl-8">{alt}</figcaption>
      </figure>
    </div>
  )
}
