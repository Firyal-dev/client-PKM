'use server'

import { clearAuthToken } from '@/services/auth-token'
import { redirect } from 'next/navigation'

// Logout - redirect ke login
export async function logoutAction() {
    await clearAuthToken()
    redirect('/admin/login')
}

// Logout - return result
export async function logoutActionWithResult() {
    await clearAuthToken()
    return { success: true, message: 'Logout berhasil' }
}
