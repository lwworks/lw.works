import {addSeconds, format} from 'date-fns'

export const refreshLongLivedAccessToken = async (longLivedAccessToken: string) => {
  const response = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${longLivedAccessToken}`, {
    method: 'GET'
  })
  const {access_token, expires_in} = await response.json()
  if (!access_token) throw new Error('Error refreshing long lived access token.')
  return {
    longLivedAccessToken: access_token,
    expires: format(addSeconds(new Date(), expires_in), 'yyyy-MM-dd HH:mm:ss')
  }
}
