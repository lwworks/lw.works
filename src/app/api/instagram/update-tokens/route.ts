import {getActiveAccounts} from '@/utils/instagram/get-active-accounts'
import {refreshLongLivedAccessToken} from '@/utils/instagram/refresh-long-lived-access-token'
import {updateAccount} from '@/utils/instagram/update-account'
import {type NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
  try {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse('Unauthorized.', {status: 401})

    const {accounts} = await getActiveAccounts()
    for (const account of accounts) {
      const {longLivedAccessToken, expires} = await refreshLongLivedAccessToken(account.token)
      await updateAccount({userId: account.user_id, data: {token: longLivedAccessToken, expires}})
    }
    console.log('Updated accounts: ', accounts.map((account) => `@${account.username}`).join(', '))

    return NextResponse.json({ok: true})
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal server error.', {status: 500})
  }
}
