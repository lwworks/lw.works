'use client'

import { useEffect } from 'react'

export const GoogleAnalyticsScript = ({ consent }: { consent: boolean }) => {
  useEffect(() => {
    let element = document.getElementById('gtag-script-ga4-1')
    if (element && !consent) element.remove()

    element = document.getElementById('gtag-script-ga4-2')
    if (element && !consent) element.remove()

    if (element || !consent) return

    let script = document.createElement('script')
    script.id = 'gtag-script-ga4-1'
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-8HSXDP4097'
    script.async = true
    document.head.appendChild(script)

    script = document.createElement('script')
    script.id = 'gtag-script-ga4-2'
    script.type = 'text/javascript'
    script.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){
        dataLayer.push(arguments);
      } 
      gtag('js', new Date()); 
      gtag('config', 'G-8HSXDP4097');
    `
    document.head.appendChild(script)
  }, [consent])

  return null
}