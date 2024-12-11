import {NextResponse, type NextRequest} from 'next/server'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  console.log('params', searchParams)
  const body = await request.json()
  console.log('body', body)

  try {
    return new NextResponse('Signup successful.', {status: 200})
  } catch (error) {
    console.log(error)
    return new NextResponse('Error connecting to your Instagram account.', {status: 500})
  }
}
