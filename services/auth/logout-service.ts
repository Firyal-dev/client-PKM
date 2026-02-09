'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { tryAction } from "../utils"

/**
 * Handle admin logout by removing token cookie
 */
export async function logoutAction(prevState: any) {
    const result = await tryAction(async () => {
        const cookieStore = await cookies()
        cookieStore.delete('token')
    }, "Logout gagal")

    if (result.success) {
        redirect('/admin/login')
    }

    return result
}