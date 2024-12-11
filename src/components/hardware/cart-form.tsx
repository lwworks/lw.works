'use client'

import {updateCartNote} from '@/utils/shopify/update-cart-note'
import {FC, FormEvent, useEffect, useState} from 'react'
import {Button} from '@/components/atoms/button'
import {Checkbox} from '@/components/atoms/checkbox'
import {TextArea} from '@/components/atoms/textarea'
import {useSWRConfig} from 'swr'
import {cartQuery} from '@/utils/shopify/cart-query'
import {Icon} from '@/components/icons'
import {getCookie} from '@/app/actions'

export const CartForm: FC<{cartId: string; cartNote: string | null; checkoutUrl: string}> = ({cartId, cartNote, checkoutUrl}) => {
  const [formData, setFormData] = useState<{comment: string; consent: boolean}>({comment: cartNote || '', consent: false})
  const [showCheckbox, setShowCheckbox] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const {mutate} = useSWRConfig()

  useEffect(() => {
    const checkConsent = async () => {
      const consent = await getCookie('consent')
      if (!consent?.value) setShowCheckbox(true)
    }
    checkConsent()
  }, [])

  const goToCheckout = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      let win = window.open(undefined, '_self')
      if (formData.comment != '') {
        const {cart} = await updateCartNote({cartId, note: formData.comment})
        localStorage.cart = JSON.stringify(cart)
        window.dispatchEvent(new Event('storage'))
        mutate(cartQuery(cartId))
      }
      win!.location = checkoutUrl
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={goToCheckout} className="flex flex-col items-start justify-end space-y-6">
      <TextArea
        id="comment"
        label="Kommentar zur Bestellung"
        placeholder="Dein Kommentar zur Bestellung..."
        data={formData}
        setData={setFormData}
        className="max-h-80 min-h-[6rem] w-full max-w-md grow"
      />
      {showCheckbox && (
        <Checkbox
          id="consent"
          label={
            <>
              Shopify darf für den Checkout notwendige Cookies in meinem Browser setzen (
              <a className="text-indigo-500 dark:text-indigo-400" target="_blank" rel="noreferrer" href="https://www.shopify.com/de/legal/cookies">
                mehr Infos
              </a>
              ).
            </>
          }
          required
          data={formData}
          setData={setFormData}
        />
      )}
      <Button submit loading={loading} hideArrow>
        <div className="flex items-center space-x-2">
          <Icon name="lock" className="h-4 opacity-70" />
          <span>Zum sicheren Checkout</span>
        </div>
      </Button>
    </form>
  )
}
