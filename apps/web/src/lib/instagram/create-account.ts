import {createClient} from '@supabase/supabase-js'

export const createAccount = async ({
  userId,
  username,
  name,
  token,
  expires
}: {
  userId: string
  username: string
  name: string
  token: string
  expires: string
}) => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_TOKEN) throw new Error('Missing Supabase credentials.')

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_TOKEN)
  const {data, error} = await supabase
    .from('instagram_accounts')
    .insert([
      {
        user_id: userId,
        username,
        name,
        token,
        expires
      }
    ])
    .select()

  if (error) throw new Error('Error storing account to Supabase.')
  return {account: data[0]}
}
