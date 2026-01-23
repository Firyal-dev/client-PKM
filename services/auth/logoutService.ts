'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logoutAction() {
    // 1. Hapus Cookie
    const cookieStore = await cookies()
    cookieStore.delete('token')
    
    // 2. Redirect ke Login
    // (Middleware nanti akan ngecek: "Oh token udah ilang", jadi aman)
    redirect('/admin/login')
}