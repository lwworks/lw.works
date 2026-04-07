'use server'

import {loadTeamMemberContent} from '@/content/contact'
import BookingConfirmationEmail from '@/emails/booking-confirmation'
import BookingLeadEmail from '@/emails/booking-lead'
import {createBookingEvent, isSlotStillAvailable} from '@/lib/google-calendar'
import {checkBotId} from 'botid/server'
import {getLocale} from 'next-intl/server'
import {Resend} from 'resend'
import {z} from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().optional(),
  memberSlug: z.string().min(1),
  slotStart: z.string().min(1),
  slotEnd: z.string().min(1),
  privacy: z.literal('on')
})

export type BookingFormState = {
  success: boolean
  error?: string
}

export async function submitBookingForm(_prevState: BookingFormState, formData: FormData): Promise<BookingFormState> {
  const botVerification = await checkBotId()
  if (botVerification.isBot) {
    return {success: false, error: 'Bot detected.'}
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message') || undefined,
    memberSlug: formData.get('memberSlug'),
    slotStart: formData.get('slotStart'),
    slotEnd: formData.get('slotEnd'),
    privacy: formData.get('privacy')
  })

  if (!parsed.success) {
    return {success: false, error: 'Validation failed.'}
  }

  const {name, email, message, memberSlug, slotStart, slotEnd} = parsed.data
  const locale = (await getLocale()) as 'de' | 'en'

  const content = await loadTeamMemberContent(memberSlug, locale)
  if (!content) {
    return {success: false, error: 'Member not found.'}
  }

  const {member, calendar} = content
  const {calendarId, timezone} = calendar.booking
  const memberEmail = calendarId
  const memberName = member.name

  // Race condition prevention: re-check availability
  const available = await isSlotStillAvailable(calendarId, slotStart, slotEnd, timezone)
  if (!available) {
    return {success: false, error: calendar.errorMessages.slotTaken}
  }

  // Create Google Calendar event
  const slotDate = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: timezone
  }).format(new Date(slotStart))

  await createBookingEvent({
    calendarId,
    summary: `Beratungsgespräch mit ${name}`,
    description: [`Name: ${name}`, `E-Mail: ${email}`, message ? `Nachricht: ${message}` : ''].filter(Boolean).join('\n'),
    startTime: slotStart,
    endTime: slotEnd,
    timezone,
    attendeeEmail: email,
    attendeeName: name
  })

  // Send emails in parallel
  const confirmationSubject = locale === 'en' ? `Your call with ${memberName} is confirmed` : `Dein Termin mit ${memberName} ist bestätigt`

  const [leadResult, confirmationResult] = await Promise.all([
    resend.emails.send({
      from: `${memberName} <booking@mailer.lw.works>`,
      to: memberEmail,
      replyTo: email,
      subject: `Terminbuchung: ${name}`,
      react: BookingLeadEmail({visitorName: name, visitorEmail: email, message, dateTime: slotDate, memberName})
    }),
    resend.emails.send({
      from: `${memberName} <booking@mailer.lw.works>`,
      to: email,
      replyTo: memberEmail,
      subject: confirmationSubject,
      react: BookingConfirmationEmail({visitorName: name, memberName, dateTime: slotDate, locale})
    })
  ])

  if (leadResult.error || confirmationResult.error) {
    return {success: false, error: 'Failed to send confirmation email.'}
  }

  return {success: true}
}
