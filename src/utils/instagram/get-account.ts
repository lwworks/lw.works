import {createClient} from '@supabase/supabase-js'

export const getAccount = async (userId: string) => {
  if (!process.env.INSTAGRAM_SUPABASE_URL || !process.env.INSTAGRAM_SUPABASE_KEY) throw new Error('Missing Supabase credentials.')

  const supabase = createClient(process.env.INSTAGRAM_SUPABASE_URL, process.env.INSTAGRAM_SUPABASE_KEY)
  const {data: accounts, error} = await supabase.from('accounts').select('*').eq('user_id', userId)

  if (error) throw new Error('Error getting account from Supabase.')
  return {account: accounts.length > 0 ? accounts[0] : null}
}
