'use server'

import ContactInquiryLeadEmail from '@/emails/contact-inquiry-lead'
import {checkBotId} from 'botid/server'
import {Resend} from 'resend'
import {z} from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  privacy: z.literal('on')
})

export type ContactInquiryFormState = {
  success: boolean
  error?: string
}

export async function submitContactInquiryForm(
  _prevState: ContactInquiryFormState,
  formData: FormData
): Promise<ContactInquiryFormState> {
  const botVerification = await checkBotId()
  if (botVerification.isBot) {
    return {success: false, error: 'Bot detected.'}
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    privacy: formData.get('privacy')
  })

  if (!parsed.success) {
    return {success: false, error: 'Validation failed.'}
  }

  const {name, email, message} = parsed.data

  const leadResult = await resend.emails.send({
    from: 'Lukas Brunkhorst <digital-dealer@mailer.lw.works>',
    to: 'lukas@lw.works',
    replyTo: email,
    subject: `Kontakt: ${name}`,
    react: ContactInquiryLeadEmail({name, email, message})
  })

  if (leadResult.error) {
    return {success: false, error: 'Failed to send email.'}
  }

  return {success: true}
}
