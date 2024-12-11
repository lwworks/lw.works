import {addSeconds, format} from 'date-fns'

export const getLongLivedAccessToken = async (shortLivedAccessToken: string) => {
  const response = await fetch(
    `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${shortLivedAccessToken}`,
    {method: 'GET'}
  )
  const {access_token, expires_in} = await response.json()
  if (!access_token) throw new Error('Error getting long lived access token.')
  return {
    longLivedAccessToken: access_token,
    expires: format(addSeconds(new Date(), expires_in), 'yyyy-MM-dd HH:mm:ss')
  }
}
