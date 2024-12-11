import {getActiveAccounts} from '@/utils/instagram/get-active-accounts'
import {type NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse('Unauthorized.', {status: 401})

    const {accounts} = await getActiveAccounts()
    console.log(accounts)

    return NextResponse.json({ok: true})
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal server error.', {status: 500})
  }
}
