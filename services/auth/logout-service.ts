'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logoutAction() {
    try {
        const cookieStore = await cookies()
        cookieStore.delete('token')
    } catch (error: any) {
        return {
            error: error?.response?.data?.message || "Logout gagal"
        }
    }

    redirect('/admin/login')
}