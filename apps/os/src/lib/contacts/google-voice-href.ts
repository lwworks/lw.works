/**
 * Google Voice link that starts a call to the number. Numbers are normalized to E.164;
 * `00…` becomes `+…` and a national `0…` number is read as German (+49).
 */
export const googleVoiceHref = (value: string) => {
  const cleaned = value.trim().replace(/[^\d+]/g, '')
  let e164: string
  if (cleaned.startsWith('+')) e164 = `+${cleaned.slice(1).replace(/\+/g, '')}`
  else if (cleaned.startsWith('00')) e164 = `+${cleaned.slice(2)}`
  else if (cleaned.startsWith('0')) e164 = `+49${cleaned.slice(1)}`
  else e164 = cleaned ? `+${cleaned}` : ''
  if (!/^\+\d{6,15}$/.test(e164)) return null
  return `https://voice.google.com/u/0/calls?a=nc,${encodeURIComponent(e164)}`
}
