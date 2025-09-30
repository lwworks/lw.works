'use server'

import {JWT} from 'google-auth-library'

const client = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY!.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/calendar']
})

const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${process.env.GOOGLE_CALENDAR_ID}/events`

export const getEvents = async (): Promise<any[]> => {
  const response: any = await client.request({
    url: endpoint,
    method: 'GET'
  })
  console.log(response)
  return []
}
