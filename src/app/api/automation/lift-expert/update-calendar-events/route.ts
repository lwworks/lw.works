import {NextResponse, type NextRequest} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse('Unauthorized.', {status: 401})

    const {projects} = await request.json()
    console.log(projects)

    return new NextResponse('Calendar events updated.', {status: 200})
  } catch (error) {
    console.error(error)
    return new NextResponse('Error updating calendar events.', {status: 500})
  }
}
