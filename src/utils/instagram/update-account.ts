import {createClient} from '@supabase/supabase-js'

export const updateAccount = async ({
  userId,
  data
}: {
  userId: string
  data: {
    active?: boolean
    token?: string
    expires?: string
  }
}) => {
  if (!process.env.INSTAGRAM_SUPABASE_URL || !process.env.INSTAGRAM_SUPABASE_KEY) throw new Error('Missing Supabase credentials.')

  const supabase = createClient(process.env.INSTAGRAM_SUPABASE_URL, process.env.INSTAGRAM_SUPABASE_KEY)
  const response = await supabase
    .from('accounts')
    .update({...data, updated_at: new Date().toISOString()})
    .eq('user_id', userId)
    .select()

  if (response.error) throw new Error('Error updating account in Supabase.')
  return {account: response.data[0]}
}
