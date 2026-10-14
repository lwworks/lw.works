import {db} from '@/lib/supabase'
import {NextResponse, type NextRequest} from 'next/server'

/**
 * Logs a completed automation run to Supabase so we can track time saved.
 *
 * Called by n8n and Power Automate after a successful run. Authenticates
 * with a shared token, verifies the automation exists, then inserts a row
 * into `automation_runs`.
 *
 * Query parameters:
 * - `token` — shared secret (`AUTOMATION_API_TOKEN`)
 * - `id` — UUID of the automation in the `automations` table
 * - `mins` — minutes saved by this run
 * - `note` — optional free-text note
 *
 * @param request - Incoming GET with the query parameters above.
 * @returns `200` on success; `400` missing params, `401` bad token,
 *   `404` unknown automation, or `500` on a database error.
 */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const data = {
    token: searchParams.get('token'),
    id: searchParams.get('id'),
    minutesSaved: searchParams.get('mins'),
    note: searchParams.get('note')
  }
  if (!data.token || !data.id || !data.minutesSaved) return new NextResponse('Bad request.', {status: 400})
  if (data.token !== process.env.AUTOMATION_API_TOKEN) return new NextResponse('Unautorized.', {status: 401})

  const automationResponse = await db.from('automations').select().eq('id', data.id)
  if (automationResponse.error) return new NextResponse('Error checking automation ID.', {status: 500})
  if (automationResponse.data.length === 0) return new NextResponse('Automation ID could not be found.', {status: 404})

  const insertResponse = await db.from('automation_runs').insert([{automation: data.id, minutes_saved: data.minutesSaved, note: data.note}])
  if (insertResponse.error) return new NextResponse('Error logging automation run.', {status: 500})

  return new NextResponse('Automation run logged.', {status: 200})
}
