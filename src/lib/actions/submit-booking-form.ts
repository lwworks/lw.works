'use server'

import { teamMemberBookingConfig, teamMemberCalendarMessages } from '@/components/pages/team-member'
import BookingConfirmationEmail from '@/emails/booking-confirmation'
import BookingLeadEmail from '@/emails/booking-lead'
import { createBookingEvent, isSlotStillAvailable } from '@/lib/google-calendar'
import { checkBotId } from 'botid/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().optional(),
  memberSlug: z.string().min(1),
  slotStart: z.string().min(1),
  slotEnd: z.string().min(1),
  privacy: z.literal('on'),
})

export type BookingFormState = {
  success: boolean
  error?: string
}

export async function submitBookingForm(_prevState: BookingFormState, formData: FormData): Promise<BookingFormState> {
  const botVerification = await checkBotId()
  if (botVerification.isBot) {
    return { success: false, error: teamMemberCalendarMessages.errorMessages.botDetected }
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message') || undefined,
    memberSlug: formData.get('memberSlug'),
    slotStart: formData.get('slotStart'),
    slotEnd: formData.get('slotEnd'),
    privacy: formData.get('privacy'),
  })

  if (!parsed.success) {
    return { success: false, error: teamMemberCalendarMessages.errorMessages.default }
  }

  const { name, email, message, memberSlug, slotStart, slotEnd } = parsed.data

  if (memberSlug !== teamMemberBookingConfig.teamMemberSlug) {
    return { success: false, error: teamMemberCalendarMessages.errorMessages.default }
  }

  const { calendarId, timezone } = teamMemberBookingConfig
  const memberEmail = calendarId
  const memberName = 'Lukas Brunkhorst'

  const available = await isSlotStillAvailable(calendarId, slotStart, slotEnd, timezone)
  if (!available) {
    return { success: false, error: teamMemberCalendarMessages.errorMessages.slotTaken }
  }

  const slotDate = new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(new Date(slotStart))

  await createBookingEvent({
    calendarId,
    summary: `Beratungsgespräch mit ${name}`,
    description: [`Name: ${name}`, `E-Mail: ${email}`, message ? `Nachricht: ${message}` : ''].filter(Boolean).join('\n'),
    startTime: slotStart,
    endTime: slotEnd,
    timezone,
    attendeeEmail: email,
    attendeeName: name,
  })

  const confirmationSubject = `Dein Termin mit ${memberName} ist bestätigt`

  const [leadResult, confirmationResult] = await Promise.all([
    resend.emails.send({
      from: `${memberName} <booking@mailer.lw.works>`,
      to: memberEmail,
      replyTo: email,
      subject: `Terminbuchung: ${name}`,
      react: BookingLeadEmail({ visitorName: name, visitorEmail: email, message, dateTime: slotDate, memberName }),
    }),
    resend.emails.send({
      from: `${memberName} <booking@mailer.lw.works>`,
      to: email,
      replyTo: memberEmail,
      subject: confirmationSubject,
      react: BookingConfirmationEmail({ visitorName: name, memberName, dateTime: slotDate, locale: 'de' }),
    }),
  ])

  if (leadResult.error || confirmationResult.error) {
    return { success: false, error: teamMemberCalendarMessages.errorMessages.default }
  }

  return { success: true }
}
