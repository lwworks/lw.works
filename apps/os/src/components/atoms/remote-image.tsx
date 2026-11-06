import { cn } from "@lw/ui/lib/utils"

/** A user-supplied https URL. It is not sent through the image optimizer, which would fetch arbitrary hosts. */
export const RemoteImage = ({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}) => {
  if (!src.startsWith('https://')) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={cn(className)} />
  )
}
