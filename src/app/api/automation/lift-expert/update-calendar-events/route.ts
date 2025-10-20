import {createEvent} from '@/utils/calendar/create-event'
import {getEvents} from '@/utils/calendar/get-events'
import {updateEvent} from '@/utils/calendar/update-event'
import {NextResponse, type NextRequest} from 'next/server'

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse('Unauthorized.', {status: 401})

    const projects = await request.json()
    console.log(projects)

    const events = await getEvents()
    let eventsCreated = []
    let eventsUpdated = []

    for (const {json: project} of projects) {
      const eventData: CalendarEvent = {
        id: project.id.replaceAll('-', ''),
        summary: project.description,
        start: {
          dateTime: project.start
        },
        end: {
          dateTime: project.end
        },
        description: `Kunde: ${project.client}`
      }

      const event = events.find((event) => event.id === eventData.id)
      if (event) {
        const {data} = await updateEvent(eventData)
        eventsUpdated.push(data)
      } else {
        const {data} = await createEvent(eventData)
        eventsCreated.push(data)
      }
    }

    return NextResponse.json(
      {
        eventsCreated: eventsCreated.map((event) => ({id: event.id, summary: event.summary})),
        eventsUpdated: eventsUpdated.map((event) => ({id: event.id, summary: event.summary}))
      },
      {status: 200}
    )
  } catch (error) {
    console.error(error)
    return new NextResponse('Error updating calendar events.', {status: 500})
  }
}
