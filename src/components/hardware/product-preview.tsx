import Image from 'next/image'
import Link from 'next/link'
import {FC} from 'react'
import {ProductCard} from './product-card'
import {Logo} from '../visuals/logo'

export const ProductPreview: FC<{product: ProductPreview}> = ({product}) => {
  return (
    <Link href={`/hardware/${product.handle}`} className="flex space-x-4">
      <div className="relative w-4 shrink-0 py-4">
        <Logo className="w-full text-black/20 dark:text-white/30" />
        <div style={{writingMode: 'vertical-rl'}} className="flex space-y-4 pt-5 font-mono uppercase leading-none text-black dark:text-white">
          <div>{product.displaySKU}</div>
          <div className="opacity-20">{'///'}</div>
          <h2>{product.displayName}</h2>
          <div className="opacity-20">{'///'}</div>
          <div>{product.displayVariant}</div>
        </div>
      </div>
      <ProductCard className="p-12" glowColor={product.accentColor}>
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          width={800}
          height={(800 * product.featuredImage.height) / product.featuredImage.width}
          className="w-full lg:transition-transform lg:duration-500 lg:group-hover:scale-105"
          placeholder="blur"
          blurDataURL={product.featuredImage.url}
        />
      </ProductCard>
    </Link>
  )
}
