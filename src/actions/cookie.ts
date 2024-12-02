"use server"

import { cookies } from 'next/headers'


export const clearTokenCookie = () : void => {
    cookies().delete('token')
}