"use client"

import { deleteAllCookies } from "@/lib/cookies"
import { Dialog } from "radix-ui"
import { useEffect, useState } from "react"
import { Link } from "../link"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { CTA } from "./cta"

const cookies = ['necessary']

export const CookieBanner = () => {
  const [open, setOpen] = useState(false)
  const [consent, setConsent] = useState<string[]>(cookies)
  const [consentGiven, setConsentGiven] = useState<boolean>(false)

  const handleCheckedChange = (id: string) => {
    if (consent.includes(id)) {
      setConsent(consent.filter((service) => service !== id))
    } else {
      setConsent([...consent, id])
    }
  }

  const closeDialog = async (all: boolean = false) => {
    if (all) {
      localStorage.setItem('consent', JSON.stringify(cookies))
    } else {
      localStorage.setItem('consent', JSON.stringify(consent))
      await deleteAllCookies()
    }
    setConsentGiven(true)
    setOpen(false)
  }

  useEffect(() => {
    const storedConsent = localStorage.getItem('consent')
    if (storedConsent) {
      setConsent(JSON.parse(storedConsent))
      setConsentGiven(true)
    } else {
      setOpen(true)
    }
  }, [open])

  return (
    <>
      {/* Example Analytics Script: */}
      {/* <GoogleAnalyticsScript consent={consentGiven && consent.includes('google-analytics')} /> */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="cursor-pointer hover:text-black dark:hover:text-white outline-none focus:outline-none">Cookies & Daten</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 isolate z-50 bg-white/10 dark:bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" >
            <div className="relative mx-auto w-full h-full max-w-4xl border-x border-black/5 dark:border-white/5" />
          </Dialog.Overlay>
          <Dialog.Content
            onEscapeKeyDown={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            className="fixed bottom-0 inset-x-0 z-50 bg-neutral-50 dark:bg-[#0F0F0F] border-t border-black/10 dark:border-white/10 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom"
          >
            <div className="relative mx-auto w-full max-w-4xl border-x border-black/10 dark:border-white/10 p-16">
              <Dialog.Title className="font-heading text-2xl font-black text-black dark:text-white">
                Cookies & Datenschutz
              </Dialog.Title>
              <Dialog.Description className="mt-4">
                Wir verwenden Cookies, um die Website zu verbessern und Dir die beste Nutzererfahrung zu bieten. Mehr Informationen findest Du in unserer <Link href="/datenschutz" className="underline text-black dark:text-white hover:opacity-80">Datenschutzerklärung</Link>.
              </Dialog.Description>
              <ul className="mt-8 space-y-2">
                <li className="flex items-start gap-3">
                  <Checkbox disabled id="necessary" checked={consent.includes('necessary')} onCheckedChange={() => handleCheckedChange('necessary')} className="mt-1.25" />
                  <label htmlFor="necessary">
                    <span className="font-semibold text-black dark:text-white text-sm">Technisch notwendig</span>
                    <span className="block text-sm text-neutral-500">Das sind Cookies und Daten, die für die Verwendung der Website notwendig sind. Konkret speichern wir Deine Präferenzen für Cookies und den Farbmodus – mehr nicht.</span>
                  </label>
                </li>
              </ul>
              <CTA className="mt-8 justify-end">
                <Button variant="outline" onClick={() => closeDialog()}>
                  Auswahl speichern
                </Button>
                <Button onClick={() => closeDialog(true)}>
                  Alle akzeptieren
                </Button>
              </CTA>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}