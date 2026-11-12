import 'server-only'

import { APICallError, generateText, Output } from 'ai'
import { z } from 'zod'

// Routed through Vercel AI Gateway: OIDC on Vercel, AI_GATEWAY_API_KEY or `vercel env pull` locally.
const model = 'anthropic/claude-opus-5.5'

const nullableText = z.string().nullable()

const BusinessCardSchema = z.object({
  firstName: nullableText.describe('Vorname der Person'),
  lastName: nullableText.describe('Nachname der Person, ohne akademische Titel'),
  email: nullableText,
  phone: nullableText.describe('Festnetz- oder Bürotelefon, international formatiert, z. B. +49 421 123456'),
  mobile: nullableText.describe('Mobilnummer, international formatiert, z. B. +49 171 1234567'),
  linkedIn: nullableText.describe('LinkedIn-Profil als vollständige URL'),
  instagram: nullableText.describe('Instagram-Profil als vollständige URL'),
  x: nullableText.describe('X/Twitter-Profil als vollständige URL'),
  company: z
    .object({
      name: nullableText,
      website: nullableText.describe('Website als vollständige URL mit https://'),
      street: nullableText.describe('Straße und Hausnummer'),
      postalCode: nullableText,
      city: nullableText,
      country: nullableText.describe('Land auf Deutsch, z. B. Deutschland'),
    })
    .nullable(),
})

export type BusinessCard = z.infer<typeof BusinessCardSchema>

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const maxBytes = 4 * 1024 * 1024

class BusinessCardError extends Error {}

type ImageType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

const readImage = async (value: FormDataEntryValue | null) => {
  if (!(value instanceof File) || value.size === 0) return null
  if (!allowedTypes.has(value.type)) throw new BusinessCardError('Bitte ein Bild (JPEG, PNG, WebP) hochladen.')
  if (value.size > maxBytes) throw new BusinessCardError('Das Bild ist zu groß.')
  return { type: value.type as ImageType, data: Buffer.from(await value.arrayBuffer()).toString('base64') }
}

const prompt = `Das sind Fotos einer Visitenkarte (Vorder- und ggf. Rückseite). Lies die Kontaktdaten der Person und ihres Unternehmens aus.
Übernimm nur, was auf der Karte steht – erfinde nichts und lass Felder leer (null), die nicht auf der Karte stehen.
Social-Media-Handles wandelst du in vollständige Profil-URLs um.`

/** Reads front and back photos of a business card (`front`, `back` in the form data) and returns the fields printed on it. */
export const extractBusinessCard = async (formData: FormData): Promise<{ ok: true; value: BusinessCard } | { ok: false; message: string }> => {
  let images: { label: string; type: ImageType; data: string }[]
  try {
    const front = await readImage(formData.get('front'))
    const back = await readImage(formData.get('back'))
    images = [
      ...(front ? [{ label: 'Vorderseite', ...front }] : []),
      ...(back ? [{ label: 'Rückseite', ...back }] : []),
    ]
  } catch (error) {
    if (error instanceof BusinessCardError) return { ok: false, message: error.message }
    throw error
  }
  if (images.length === 0) return { ok: false, message: 'Bitte mindestens eine Seite der Visitenkarte hochladen.' }

  try {
    const { output } = await generateText({
      model,
      reasoning: 'low',
      output: Output.object({ schema: BusinessCardSchema }),
      messages: [
        {
          role: 'user',
          content: [
            ...images.flatMap((image) => [
              { type: 'text' as const, text: image.label },
              { type: 'file' as const, mediaType: image.type, data: image.data },
            ]),
            { type: 'text' as const, text: prompt },
          ],
        },
      ],
    })
    return { ok: true, value: output }
  } catch (error) {
    // Log only the error type and status: AI SDK errors carry the response text and request body, i.e. the card's contents.
    const name = error instanceof Error ? error.name : typeof error
    const status = APICallError.isInstance(error) ? ` ${error.statusCode ?? ''}` : ''
    console.error(`extractBusinessCard failed: ${name}${status}`)
    return { ok: false, message: 'Die Visitenkarte konnte nicht ausgelesen werden. Bitte später erneut versuchen.' }
  }
}
