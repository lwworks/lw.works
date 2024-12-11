import {createClient} from '@supabase/supabase-js'

export const getActiveAccounts = async () => {
  if (!process.env.INSTAGRAM_SUPABASE_URL || !process.env.INSTAGRAM_SUPABASE_KEY) throw new Error('Missing Supabase credentials.')

  const supabase = createClient(process.env.INSTAGRAM_SUPABASE_URL, process.env.INSTAGRAM_SUPABASE_KEY)
  const {data: accounts, error} = await supabase.from('accounts').select('*').is('active', true)

  if (error) throw new Error('Error getting accounts from Supabase.')
  return {accounts}
}
