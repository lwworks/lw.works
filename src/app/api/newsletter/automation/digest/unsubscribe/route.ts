import {NextResponse, type NextRequest} from 'next/server'
import {emailHash} from '@/utils/sendgrid/email-hash'
import {updateContacts} from '@/utils/sendgrid/update-contacts'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const data = {
    email: searchParams.get('email'),
    hash: searchParams.get('hash'),
    redirect: searchParams.get('redirect') === 'true'
  }

  if (!data.email || !data.hash) return new NextResponse('Bad request.', {status: 400})
  if (data.hash !== emailHash(data.email)) return new NextResponse('Unautorized.', {status: 401})

  const res = await updateContacts([
    {
      email: data.email,
      custom_fields: {
        digest_frequency: 'none'
      }
    }
  ])
  if (res.status !== 202) return new NextResponse('Error unsubscribing.', {status: 500})

  if (data.redirect) return NextResponse.redirect(new URL(`/automation/digest/unsubscribed?email=${data.email}`, request.url))
  return new NextResponse('Unsubscribe successful.', {status: 200})
}
