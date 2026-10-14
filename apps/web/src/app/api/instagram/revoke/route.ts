import {parseSignedRequest} from '@/lib/instagram/parse-signed-request'
import {updateAccount} from '@/lib/instagram/update-account'
import {NextResponse, type NextRequest} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.INSTAGRAM_APP_SECRET) throw new Error('Missing Instagram credentials.')

    const formData = await request.formData()
    const body = Object.fromEntries(formData)
    const data = parseSignedRequest(body.signed_request as string, process.env.INSTAGRAM_APP_SECRET)
    if (!data) throw new Error('Invalid signed request.')
    const {account} = await updateAccount({userId: data.user_id, data: {active: false}})
    return new NextResponse('Webhook received', {status: 200})
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Error processing webhook', {status: 500})
  }
}
