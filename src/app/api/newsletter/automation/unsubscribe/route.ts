import {NextResponse, type NextRequest} from 'next/server'
import {emailHash} from '@/utils/sendgrid/email-hash'
import {getContactsByEmails} from '@/utils/sendgrid/get-contacts-by-emails'
import {removeContactsFromList} from '@/utils/sendgrid/remove-contacts-from-list'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const data = {
    email: searchParams.get('email'),
    hash: searchParams.get('hash'),
    redirect: searchParams.get('redirect') === 'true'
  }

  if (!data.email || !data.hash) return new NextResponse('Bad request.', {status: 400})
  if (data.hash !== emailHash(data.email)) return new NextResponse('Unautorized.', {status: 401})

  const searchRes = await getContactsByEmails([data.email])
  const search = await searchRes.json()
  const {contact} = search.result[data.email]

  const removeRes = await removeContactsFromList({list_id: 'afe8ab26-62b2-4dc5-a3ab-1be873341cc5', contact_ids: [contact.id]})
  if (removeRes.status !== 202) return new NextResponse('Error unsubscribing.', {status: 500})

  if (data.redirect)
    return NextResponse.redirect(new URL(`/automation/newsletter/unsubscribed?name=${contact.first_name}&email=${data.email}`, request.url))
  return new NextResponse('Unsubscribe successful.', {status: 200})
}
