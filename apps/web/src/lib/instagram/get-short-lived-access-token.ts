export const getShortLivedAccessToken = async (code: string) => {
  if (!process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || !process.env.INSTAGRAM_APP_SECRET) throw new Error('Missing Instagram credentials.')

  const response = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'https://lw.works/api/instagram/login'
    })
  })
  const {access_token, user_id} = await response.json()
  if (!access_token) throw new Error('Error getting short lived access token.')
  return {
    shortLivedAccessToken: access_token,
    userId: user_id
  }
}
