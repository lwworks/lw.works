'use server'

import DigitalDealerConfirmationEmail from '@/emails/digital-dealer-confirmation'
import DigitalDealerLeadEmail from '@/emails/digital-dealer-lead'
import { checkBotId } from 'botid/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name: z.string().min(1),
  dealership: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  plans: z.array(z.string()),
  privacy: z.literal('on'),
})

export type ContactFormState = {
  success: boolean
  error?: string
}

export async function submitDigitalDealerForm(_prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const botVerification = await checkBotId()
  if (botVerification.isBot) {
    return { success: false, error: 'Bot detected.' }
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    dealership: formData.get('dealership'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    plans: formData.getAll('plans'),
    privacy: formData.get('privacy'),
  })

  if (!parsed.success) {
    return { success: false, error: 'Validation failed.' }
  }

  const { name, dealership, email, phone, plans } = parsed.data

  const [leadResult, confirmationResult] = await Promise.all([
    resend.emails.send({
      from: 'Lukas Brunkhorst <digital-dealer@mailer.lw.works>',
      to: 'lukas@lw.works',
      replyTo: email,
      subject: `Digital Dealer Anfrage: ${dealership}`,
      react: DigitalDealerLeadEmail({ name, dealership, email, phone, plans }),
    }),
    resend.emails.send({
      from: 'Lukas Brunkhorst <digital-dealer@mailer.lw.works>',
      to: email,
      replyTo: 'lukas@lw.works',
      subject: 'Ihre Digital Dealer Anfrage',
      react: DigitalDealerConfirmationEmail({ name, dealership, plans, locale: 'de' }),
    }),
  ])

  if (leadResult.error || confirmationResult.error) {
    return { success: false, error: 'Failed to send email.' }
  }

  return { success: true }
}
