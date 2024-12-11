import {createAccount} from '@/utils/instagram/create-account'
import {getAccount} from '@/utils/instagram/get-account'
import {getLongLivedAccessToken} from '@/utils/instagram/get-long-lived-access-token'
import {getShortLivedAccessToken} from '@/utils/instagram/get-short-lived-access-token'
import {getUserData} from '@/utils/instagram/get-user-data'
import {updateAccount} from '@/utils/instagram/update-account'
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

    const {shortLivedAccessToken} = await getShortLivedAccessToken(data.code.replace('#_', ''))
    const {longLivedAccessToken, expires} = await getLongLivedAccessToken(shortLivedAccessToken)
    const {username, name, userId} = await getUserData(longLivedAccessToken)
    const {account} = await getAccount({userId})

    if (account) await updateAccount({userId, data: {active: true, token: longLivedAccessToken, expires}})
    else await createAccount({userId, username, name, token: longLivedAccessToken, expires})

    return NextResponse.redirect(new URL(`/integrations/instagram/success?username=${username}`, request.url))
  } catch (error) {
    console.log(error)
    return NextResponse.redirect(new URL(`/integrations/instagram/error`, request.url))
  }
}
