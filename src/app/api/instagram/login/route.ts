import {createAccount} from '@/utils/instagram/create-account'
import {getLongLivedAccessToken} from '@/utils/instagram/get-long-lived-access-token'
import {getShortLivedAccessToken} from '@/utils/instagram/get-short-lived-access-token'
import {getUsername} from '@/utils/instagram/get-username'
import {NextResponse, type NextRequest} from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const data = {
      code: searchParams.get('code'),
      error: searchParams.get('error')
    }

    if (data.error) return NextResponse.redirect(new URL(`/integrations/instagram/canceled`, request.url))
    if (!data.code) return new NextResponse('Bad request.', {status: 400})

    const {shortLivedAccessToken, userId} = await getShortLivedAccessToken(data.code.replace('#_', ''))
    const {longLivedAccessToken, expires} = await getLongLivedAccessToken(shortLivedAccessToken)
    const {username, name} = await getUsername(longLivedAccessToken)
    const {account} = await createAccount({userId, username, name, token: longLivedAccessToken, expires})
    return NextResponse.redirect(new URL(`/integrations/instagram/success?username=${username}`, request.url))
  } catch (error) {
    console.log(error)
    return new NextResponse('Error connecting to your Instagram account.', {status: 500})
  }
}
