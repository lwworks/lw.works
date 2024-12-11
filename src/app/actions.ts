'use server'

import {cookies} from 'next/headers'

export const setCookie = async (name: string, value: string) => {
  cookies().set(name, value, {maxAge: 34560000, secure: true})
}

export const getCookie = async (name: string) => {
  return cookies().get(name)
}

export const deleteCookie = async (name: string) => {
  cookies().delete(name)
}
