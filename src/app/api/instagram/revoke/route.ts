import {NextResponse, type NextRequest} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('body:', body)
    return new NextResponse('Signup successful.', {status: 200})
  } catch (error) {
    console.log(error)
    return new NextResponse('Error connecting to your Instagram account.', {status: 500})
  }
}
