'use client'

import { Main } from "@lw/ui/atoms/main"
import { BniReferralsSection } from "@/components/sections/bni/referrals"
import { BookingConfirmationSection } from "@/components/sections/booking/confirmation"

export const BniConfirmationPage = () => {
  return (
    <Main>
      <BookingConfirmationSection fallback="/bni" />
      <BniReferralsSection />
    </Main>
  )
}