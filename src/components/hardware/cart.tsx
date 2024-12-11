'use client'
import {CartLine} from '@/components/hardware/cart-line'
import {cartQuery} from '@/utils/shopify/cart-query'
import {fetcher} from '@/utils/shopify/fetcher'
import {FC, useEffect, useState} from 'react'
import useSWR from 'swr'
import {currency} from '@/utils/shopify/currency'
import {Paragraph} from '@/components/atoms/paragraph'
import {Button} from '@/components/atoms/button'
import {Loader} from '@/components/atoms/loader'
import {CartForm} from '@/components/hardware/cart-form'

type Content = {
  heading: string
  error: string
  empty: string
  seeProducts: string
  table: {deleteItem: string; total: string}
  form: {comment: string; checkout: string}
}

export const Cart: FC<{content: Content}> = ({content}) => {
  const [cartId, setCartId] = useState<string | null>('')

  useEffect(() => {
    setCartId(localStorage.cart ? JSON.parse(localStorage.cart).id : '')
  }, [])

  const {data, error, isLoading} = useSWR(cartQuery(cartId), fetcher)

  if (error || data?.error) return <Paragraph size="lg">{content.error}</Paragraph>
  if (isLoading)
    return (
      <div className="flex justify-center pt-24">
        <Loader />
      </div>
    )

  const cart: Cart = data?.data?.cart
  if (!cartId || !cart || cart.totalQuantity === 0)
    return (
      <div>
        <Paragraph size="lg" className="mb-4 max-w-md">
          {content.empty}
        </Paragraph>
        <Button href="/hardware">{content.seeProducts}</Button>
      </div>
    )

  return (
    <div className="relative grid grid-cols-1 gap-16 lg:grid-cols-3 xl:gap-24">
      <div className="relative w-full lg:col-span-2">
        <table className="w-full">
          <tbody>
            {cart.lines.edges.map(({node}, index) => (
              <CartLine content={{deleteItem: content.table.deleteItem}} cartId={cartId} line={node} key={index} />
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 dark:border-slate-700">
              <td className="hidden pr-8 pb-1 pt-4 text-right font-mono uppercase text-black dark:text-white sm:table-cell">{content.table.total}</td>
              <td className="pt-4 pb-1 font-mono text-black dark:text-white">
                <div className="flex justify-end space-x-1 uppercase  text-black dark:text-white">
                  <span className="mr-8 sm:hidden">{content.table.total}</span>
                  <span>
                    {/* @ts-ignore */}
                    {currency[cart.cost.totalAmount.currencyCode]}
                  </span>
                  <span>{new Number(cart.cost.totalAmount.amount).toFixed(0)}</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="absolute bottom-11 h-0.5 w-full bg-gradient-to-r from-white to-transparent dark:from-[#0E1117] sm:via-white dark:sm:via-[#0E1117]" />
      </div>
      <CartForm cartId={cartId} cartNote={cart.note} checkoutUrl={cart.checkoutUrl} />
    </div>
  )
}
