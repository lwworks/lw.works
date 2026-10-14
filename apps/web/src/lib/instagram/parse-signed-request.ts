import {createHmac} from 'crypto'
import {decodeUrl} from './decode-url'

export const parseSignedRequest = (signedRequest: string, appSecret: string): Record<string, any> | null => {
  const [encodedSig, payload] = signedRequest.split('.')
  if (!encodedSig || !payload) throw new Error('Invalid signed request format')
  const sig = decodeUrl(encodedSig)
  const data = JSON.parse(decodeUrl(payload).toString('utf-8'))
  const expectedSig = createHmac('sha256', appSecret).update(payload).digest()
  if (!sig.equals(expectedSig)) throw new Error('Bad Signed JSON signature!')
  return data
}
