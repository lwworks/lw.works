'use client'

import { type BookingFormState, submitBookingForm } from '@/lib/actions/submit-booking-form'
import { ReactNode, useActionState, useEffect, useRef } from 'react'

export const BookingForm = ({
  successMessage,
  children
}: {
  successMessage: string
  children: ReactNode
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: BookingFormState = { success: false }
  const [state, formAction] = useActionState(submitBookingForm, initialState)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction}>
      {children}
      {state.error && (
        <p className="px-16 pb-6 text-sm text-red-600 dark:text-red-400" aria-live="polite">{state.error}</p>
      )}
      {state.success && (
        <p className="px-16 pb-6 text-sm text-green-600 dark:text-green-400" aria-live="polite">{successMessage}</p>
      )}
    </form>
  )
}
