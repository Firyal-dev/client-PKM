'use server'

import { clearAuthToken } from '@/services/auth-token'
import { redirect } from 'next/navigation'

/**
 * Handle admin logout (Server Action)
 */
export async function logoutAction() {
    await clearAuthToken()
    redirect('/admin/login')
}

/**
 * Logout and return to login page (no redirect, returns result)
 */
export async function logoutActionWithResult() {
    await clearAuthToken()
    return { success: true, message: 'Logout berhasil' }
}
