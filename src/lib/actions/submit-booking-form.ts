'use server'

import BookingConfirmationEmail from '@/emails/booking-confirmation'
import BookingLeadEmail from '@/emails/booking-lead'
import {tz} from '@date-fns/tz'
import {checkBotId} from 'botid/server'
import {addMinutes, format} from 'date-fns'
import {Resend} from 'resend'
import {z} from 'zod'
import {bookingConfigs} from '../booking-configs'
import {checkSlotAvailability} from '../google-calendar/check-slot-availability'
import {createBookingEvent} from '../google-calendar/create-booking-event'

export type BookingFormData = {
  bookingConfig: string
  name: string
  email: string
  type: 'online' | 'phone'
  phone: string
  message: string
  slot: string
  privacy: 'on'
}

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  bookingConfig: z.enum(Object.keys(bookingConfigs)),
  name: z.string().min(1),
  email: z.email(),
  type: z.enum(['online', 'phone']).optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  slot: z.string().min(1),
  privacy: z.literal('on')
})

export type BookingFormState = {
  success: boolean
  error?: string
}

export async function submitBookingForm(_prevState: BookingFormState, formData: FormData): Promise<BookingFormState> {
  try {
    // Spam protection with Vercel botId
    const botVerification = await checkBotId()
    if (botVerification.isBot) {
      return {success: false, error: 'Deine Anfrage wurde wegen Spam-Verdacht abgelehnt.'}
    }

    // Parse form data
    const parsed = schema.safeParse({
      bookingConfig: formData.get('bookingConfig'),
      name: formData.get('name'),
      email: formData.get('email'),
      type: formData.get('type') || undefined,
      phone: formData.get('phone') || undefined,
      message: formData.get('message') || undefined,
      slot: formData.get('slot'),
      privacy: formData.get('privacy')
    })
    if (!parsed.success) return {success: false, error: 'Die eingegebenen Daten sind fehlerhaft.'}
    const {bookingConfig, name, email, type, phone, message, slot} = parsed.data

    // Get booking config
    const config = bookingConfigs[bookingConfig as keyof typeof bookingConfigs]
    if (!config) return {success: false, error: 'Die ausgewählte Buchungsart ist nicht verfügbar.'}

    // Prepare booking data
    const timezone = tz(config.timezone)
    const calendarId = config.calendarId
    const memberName = config.teamMember
    const start = timezone(new Date(slot))
    const end = timezone(addMinutes(new Date(slot), config.slotDuration))

    // Check slot availability
    const available = await checkSlotAvailability(calendarId, start.toISOString(), end.toISOString(), config.timezone)
    if (!available) return {success: false, error: 'Der gewählte Termin ist leider nicht mehr verfügbar. Bitte wählen einen anderen Termin.'}

    // Create calendar event
    const event = await createBookingEvent({bookingConfig: config, bookingFormData: parsed.data as BookingFormData})
    console.log(event)
    // Send emails
    const [confirmationResult, leadResult] = await Promise.all([
      resend.emails.send({
        from: `${memberName} <booking@mailer.lw.works>`,
        to: `${name} <${email}>`,
        replyTo: email,
        subject: `Terminbuchung: ${name}`,
        react: BookingConfirmationEmail({
          eventName: config.name,
          name: name,
          teamMember: memberName,
          date: format(start, 'EEEE, dd. MMMM yyyy'),
          time: `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')} Uhr`,
          type: type as 'online' | 'phone',
          phone,
          meetUrl: event.hangoutLink ?? undefined,
          message
        })
      }),
      resend.emails.send({
        from: `LW Works GmbH <booking@mailer.lw.works>`,
        to: `${memberName} <${config.calendarId}>`,
        replyTo: email,
        subject: `Terminbuchung: ${name}`,
        react: BookingLeadEmail({
          eventName: config.name,
          name: name,
          email: email,
          phone: phone,
          date: format(start, 'EEEE, dd. MMMM yyyy'),
          time: `${format(start, 'HH:mm')}`,
          type: type as 'online' | 'phone',
          message: message
        })
      })
    ])

    return {success: true}
  } catch (error) {
    console.log('Error:', error)
    return {success: false, error: 'Bei der Buchung ist leider ein Fehler aufgetreten. Bitte versuche es erneut.'}
  }
}
