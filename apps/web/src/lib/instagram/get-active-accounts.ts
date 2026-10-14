import {createClient} from '@supabase/supabase-js'

export const getActiveAccounts = async () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_TOKEN) throw new Error('Missing Supabase credentials.')

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_TOKEN)
  const {data: accounts, error} = await supabase.from('instagram_accounts').select('*').is('active', true)

  if (error) throw new Error('Error getting accounts from Supabase.')
  return {accounts}
}
