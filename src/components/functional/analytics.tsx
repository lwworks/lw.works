/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import {useEffect} from 'react'
import * as fathom from 'fathom-client'

export default function Analytics({}) {
  useEffect(() => {
    fathom.load(process.env.NEXT_PUBLIC_FATHOM_ID as string, {includedDomains: ['lw.works', 'www.lw.works']})
    const onRouteChange = () => fathom.trackPageview()
    window.addEventListener('routeChange', onRouteChange)
    return () => window.removeEventListener('routeChange', onRouteChange)
  }, [])

  return null
}
