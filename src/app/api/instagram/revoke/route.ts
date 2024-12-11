import {NextResponse, type NextRequest} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the raw form data
    const formData = await request.formData()

    // Convert formData to a regular object
    const body = Object.fromEntries(formData)

    // Get the signature from headers
    const signature = request.headers.get('x-hub-signature')

    // TODO: Verify signature here
    // const isValid = verifySignature(rawBody, signature, webhookSecret)
    // if (!isValid) {
    //   return new NextResponse('Invalid signature', { status: 401 })
    // }

    console.log('Webhook body:', body)
    return new NextResponse('Webhook received', {status: 200})
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Error processing webhook', {status: 500})
  }
}
