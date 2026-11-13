import { describe, expect, it } from 'vitest'
import { googleVoiceHref } from '@/lib/contacts/google-voice-href'

const href = (e164: string) => `https://voice.google.com/u/0/calls?a=nc,${encodeURIComponent(e164)}`

describe('googleVoiceHref', () => {
  it('keeps international numbers and strips formatting', () => {
    expect(googleVoiceHref('+49 (171) 123-4567')).toBe(href('+491711234567'))
  })

  it('turns 00 into +', () => {
    expect(googleVoiceHref('0041 44 123 45 67')).toBe(href('+41441234567'))
  })

  it('reads national numbers as German', () => {
    expect(googleVoiceHref('0171 1234567')).toBe(href('+491711234567'))
  })

  it('returns null for something that is not a phone number', () => {
    expect(googleVoiceHref('n/a')).toBeNull()
  })
})
