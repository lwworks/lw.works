'use server'

import {cookies} from 'next/headers'

export const deleteAllCookies = async () => {
  const cookieStore = await cookies()
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name)
  })
}
