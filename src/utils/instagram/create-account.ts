import {createClient} from '@supabase/supabase-js'

export const createAccount = async ({
  userId,
  scopedId,
  username,
  name,
  token,
  expires
}: {
  userId: string
  scopedId: string
  username: string
  name: string
  token: string
  expires: string
}) => {
  if (!process.env.INSTAGRAM_SUPABASE_URL || !process.env.INSTAGRAM_SUPABASE_KEY) throw new Error('Missing Supabase credentials.')

  const supabase = createClient(process.env.INSTAGRAM_SUPABASE_URL, process.env.INSTAGRAM_SUPABASE_KEY)
  const {data, error} = await supabase
    .from('accounts')
    .insert([
      {
        user_id: userId,
        scoped_id: scopedId,
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
