'use client'

import {createCart} from '@/utils/shopify/create-cart'
import {addCartLine} from '@/utils/shopify/add-cart-line'
import {FC, ReactNode, useState} from 'react'
import Link from 'next/link'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import {Button} from '../atoms/button'
import {PopoverNote} from '../atoms/popover-note'
import {QuantityInput} from '../atoms/quantity-input'
import {currency} from '@/utils/shopify/currency'

type Content = {
  availability: {
    select: string
    notAvailable: string
    inStock: string
    notInStock: string
  }
  priceNote: string
  addToCart: string
  addedToCart: string
}

export const VariantSelection: FC<{product: Product; content: Content}> = ({product, content}) => {
  const isEqual = require('lodash.isequal')
  const [variant, setVariant] = useState<ProductVariant>()
  const [count, setCount] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<{type: 'success' | 'error'; message: string | ReactNode} | null>(null)

  const selectVariant = ({option, value}: {option: string; value: string}) => {
    const selectedOptions = variant ? variant.selectedOptions.map((o) => (o.name === option ? {name: option, value} : o)) : [{name: option, value}]
    const newVariant = product.variants.find((v) => isEqual(v.selectedOptions, selectedOptions))
    setVariant(newVariant)
  }

  const showMessage = (type: 'error' | 'success', message: string | ReactNode) => {
    setMessage({type, message})
    setTimeout(() => setMessage(null), 2000)
  }

  const addToCart = async () => {
    if (!variant) {
      showMessage('error', 'Bitte wähle eine Größe!')
      return
    }
    try {
      setLoading(true)
      setMessage(null)
      if (!('cart' in localStorage)) {
        const {cart} = await createCart({variantId: variant.id, quantity: count})
        localStorage.cart = JSON.stringify(cart)
        window.dispatchEvent(new Event('storage'))
      } else {
        const cartId = JSON.parse(localStorage.cart).id
        const {cart} = await addCartLine({cartId, variantId: variant.id, quantity: count})
        localStorage.cart = JSON.stringify(cart)
        window.dispatchEvent(new Event('storage'))
      }
      showMessage('success', content.addedToCart)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-16 md:mt-8">
      <div className="mb-8">
        {product.options.map(({name, values}, index) => (
          <div key={index}>
            <h3 className="sr-only">{name}</h3>
            <ToggleGroup.Root type="single" className="-my-1 -ml-1" onValueChange={(value) => selectVariant({option: name, value})}>
              {values.map((value, index) => (
                <ToggleGroup.Item
                  key={index}
                  value={value}
                  aria-label={value}
                  className="m-1 rounded-full border border-slate-500 bg-slate-800/5 px-2 font-mono uppercase text-slate-600 hover:bg-slate-300/5 focus:bg-white/20 focus:outline-none data-[state=on]:border-black data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:focus:bg-black dark:border-slate-400 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20 dark:data-[state=on]:border-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-black dark:data-[state=on]:focus:bg-white"
                >
                  {value}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </div>
        ))}
        <p className="mt-2 text-sm">
          {!variant && <span>{content.availability.select}</span>}
          {variant && !variant.availableForSale && <span>{content.availability.notAvailable}</span>}
          {variant && variant.availableForSale && !variant.currentlyNotInStock && (
            <span className="text-emerald-600 dark:text-emerald-300">{content.availability.inStock}</span>
          )}
          {variant && variant.availableForSale && variant.currentlyNotInStock && (
            <span className="text-emerald-600 dark:text-emerald-300">{content.availability.notInStock}</span>
          )}
        </p>
      </div>
      <div>
        <div className="sm:flex sm:items-center md:flex-col md:items-start md:space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="mb-4 flex items-center sm:mb-0">
            <div className="flex space-x-1 font-mono text-4xl text-black dark:text-white">
              <span>
                {/* @ts-ignore */}
                {variant ? currency[variant.price.currencyCode] : currency[product.priceRange.minVariantPrice.currencyCode]}
              </span>
              <span>{new Number(variant?.price.amount ?? product.priceRange.minVariantPrice.amount).toFixed(0)}</span>
            </div>
            <div className="ml-3 mr-8 text-sm leading-[1.125] text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{__html: content.priceNote}} />
          </div>
          <div className="flex space-x-2">
            <QuantityInput count={count} setCount={setCount} />
            <div className="relative">
              <Button action={addToCart} loading={loading} disabled={!variant || !variant.availableForSale}>
                {content.addToCart}
              </Button>
              {message && <PopoverNote type={message.type}>{message.message}</PopoverNote>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
