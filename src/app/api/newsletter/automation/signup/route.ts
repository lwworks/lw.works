import {NextResponse, type NextRequest} from 'next/server'
import {addContactsToList} from '@/utils/sendgrid/add-contacts-to-list'
import {emailHash} from '@/utils/sendgrid/email-hash'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const data = {
    name: searchParams.get('name'),
    email: searchParams.get('email'),
    hash: searchParams.get('hash'),
    redirect: searchParams.get('redirect') === 'true'
  }

  if (!data.name || !data.email || !data.hash) return new NextResponse('Bad request.', {status: 400})
  if (data.hash !== emailHash(data.email)) return new NextResponse('Unautorized.', {status: 401})

  const res = await addContactsToList({
    list_ids: ['afe8ab26-62b2-4dc5-a3ab-1be873341cc5'],
    contacts: [
      {
        first_name: data.name,
        email: data.email
      }
    ]
  })
  if (res.status !== 202) return new NextResponse('Error signing up.', {status: 500})

  if (data.redirect) return NextResponse.redirect(new URL(`/automation/newsletter/thanks?name=${data.name}&email=${data.email}`, request.url))
  return new NextResponse('Signup successful.', {status: 200})
}
