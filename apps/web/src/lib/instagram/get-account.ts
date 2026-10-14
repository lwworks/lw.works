import {createClient} from '@supabase/supabase-js'

export const getAccount = async ({userId, username}: {userId?: string; username?: string}) => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_TOKEN) throw new Error('Missing Supabase credentials.')
  if (!userId && !username) throw new Error('Missing userId or username.')

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_TOKEN)
  const {data: accounts, error} = await supabase
    .from('instagram_accounts')
    .select('*')
    .eq(userId ? 'user_id' : 'username', userId ?? username)

  if (error) throw new Error('Error getting account from Supabase.')
  return {account: accounts.length > 0 ? accounts[0] : null}
}
