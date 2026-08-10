'use client'

import { Button } from '@/components/ui/button'
import { type BookingFormState, submitBookingForm } from '@/lib/actions/submit-booking-form'
import { CheckCircleSolid, Send, Spinner } from '@mynaui/icons-react'
import { createContext, ReactNode, useActionState, useContext, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'

type BookingFormContextValue = {
  error?: string
  success: boolean
  successMessage: string
  slotsVersion: number
}

const BookingFormContext = createContext<BookingFormContextValue | null>(null)

export const useBookingForm = () => useContext(BookingFormContext)

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
  const [slotsVersion, setSlotsVersion] = useState(0)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      setSlotsVersion((version) => version + 1)
    }
  }, [state])

  return (
    <BookingFormContext.Provider
      value={{
        error: state.error,
        success: state.success,
        successMessage,
        slotsVersion,
      }}
    >
      <form ref={formRef} action={formAction}>
        {children}
      </form>
    </BookingFormContext.Provider>
  )
}

export const BookingSubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Spinner data-icon="inline-start" className="animate-spin" />
      ) : (
        <Send data-icon="inline-start" strokeWidth={2} />
      )}
      <span>{label}</span>
    </Button>
  )
}

export const BookingFormStatus = () => {
  const status = useBookingForm()

  if (!status) return null

  if (status.error) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400" aria-live="polite">
        {status.error}
      </p>
    )
  }

  if (status.success) {
    return (
      <div className="flex gap-2">
        <div className="relative size-5 shrink-0">
          <div className="absolute inset-0.5 bg-black rounded-full" />
          <CheckCircleSolid className="relative size-5 text-lime" />
        </div>
        <p className="text-sm" aria-live="polite">
          {status.successMessage}
        </p>
      </div>
    )
  }

  return null
}
