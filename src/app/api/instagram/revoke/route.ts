import {NextResponse, type NextRequest} from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  console.log(searchParams)

  try {
    return new NextResponse('Signup successful.', {status: 200})
  } catch (error) {
    console.log(error)
    return new NextResponse('Error connecting to your Instagram account.', {status: 500})
  }
}
