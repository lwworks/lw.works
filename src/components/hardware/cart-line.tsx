import {removeCartLine} from '@/utils/shopify/remove-cart-line'
import {updateCartLine} from '@/utils/shopify/update-cart-line'
import Image from 'next/image'
import Link from 'next/link'
import {FC, useEffect, useState} from 'react'
import {Button} from '@/components/atoms/button'
import {QuantityInput} from '@/components/atoms/quantity-input'
import {useSWRConfig} from 'swr'
import {cartQuery} from '@/utils/shopify/cart-query'
import {currency} from '@/utils/shopify/currency'
import {ProductCard} from '@/components/hardware/product-card'
import {Icon} from '../icons'

type Content = {
  deleteItem: string
}

export const CartLine: FC<{content: Content; cartId: string; line: CartLine}> = ({content, cartId, line}) => {
  const [count, setCount] = useState<number>(line.quantity)
  const [quantityLoading, setQuantityLoading] = useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const {mutate} = useSWRConfig()

  const deleteLine = async () => {
    try {
      setDeleteLoading(true)
      const {cart} = await removeCartLine({cartId, lineId: line.id})
      localStorage.cart = JSON.stringify(cart)
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      console.log(error)
    } finally {
      setDeleteLoading(false)
      mutate(cartQuery(cartId))
    }
  }

  useEffect(() => {
    const updateQuantity = async (quantity: number) => {
      try {
        setQuantityLoading(true)
        const {cart} = await updateCartLine({cartId, lineId: line.id, quantity})
        localStorage.cart = JSON.stringify(cart)
        window.dispatchEvent(new Event('storage'))
      } catch (error) {
        console.log(error)
      } finally {
        setQuantityLoading(false)
        mutate(cartQuery(cartId))
      }
    }
    if (count !== line.quantity) updateQuantity(count)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  return (
    <tr className="w-full">
      <td className="pb-12 sm:pr-8 sm:pb-4">
        <div className="sm:flex sm:items-start sm:space-x-8">
          <Link href={`/hardware/${line.merchandise.product.handle}`} className="group block w-28">
            <ProductCard className="w-full rounded-2xl p-6" glowColor={line.merchandise.product.accentColor.value}>
              <Image
                src={line.merchandise.product.featuredImage.url}
                alt={line.merchandise.product.featuredImage.altText}
                width={200}
                height={(200 * line.merchandise.product.featuredImage.height) / line.merchandise.product.featuredImage.width}
                className="w-full lg:transition-transform lg:duration-500 lg:group-hover:scale-105"
                placeholder="blur"
                blurDataURL={line.merchandise.product.featuredImage.url}
              />
            </ProductCard>
          </Link>
          <div className="relative pt-4">
            <Link href={`/hardware/${line.merchandise.product.handle}`} className="font-mono uppercase leading-none text-black dark:text-white">
              <span
                className="brightness-75 saturate-200 dark:brightness-100 dark:saturate-100"
                style={{color: line.merchandise.product.accentColor.value}}
              >
                {line.merchandise.sku}
              </span>
              <span className="mx-2 opacity-20">{'///'}</span>
              <br className="sm:hidden" />
              <span>{line.merchandise.product.title}</span>
              <span className="mx-2 opacity-20">{'///'}</span>
              <span>{line.merchandise.title}</span>
            </Link>
            <div className="mt-4 flex flex-col items-start space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 ">
              <QuantityInput count={count} setCount={setCount} loading={quantityLoading} />
              <Button secondary hideArrow action={deleteLine} loading={deleteLoading}>
                <div className="flex items-center space-x-2">
                  <Icon name="trash" className="h-4 opacity-70" />
                  <span>{content.deleteItem}</span>
                </div>
              </Button>
            </div>
            <div className="absolute bottom-0 right-0 flex space-x-1 pb-1 font-mono text-lg text-black dark:text-white sm:hidden">
              <span>
                {/* @ts-ignore */}
                {currency[line.cost.subtotalAmount.currencyCode]}
              </span>
              <span>{new Number(line.cost.subtotalAmount.amount).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden py-4 align-top font-mono leading-none sm:table-cell">
        <div className="flex justify-end space-x-1 pt-1 text-black dark:text-white">
          <span>
            {/* @ts-ignore */}
            {currency[line.cost.subtotalAmount.currencyCode]}
          </span>
          <span>{new Number(line.cost.subtotalAmount.amount).toFixed(0)}</span>
        </div>
      </td>
    </tr>
  )
}
