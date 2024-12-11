'use client'

import {useEffect} from 'react'

export const RemoveCartData = () => {
  useEffect(() => {
    if ('cart' in localStorage) {
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('storage'))
      location.reload()
    }
  }, [])
  return null
}
