'use client'

import { BniReferralsSection } from "@/components/sections/bni/referrals"
import { BookingConfirmationSection } from "@/components/sections/booking/confirmation"

export const BniConfirmationPage = () => {
  return (
    <main className="pt-16">
      <BookingConfirmationSection fallback="/bni" />
      <BniReferralsSection />
    </main>
  )
}