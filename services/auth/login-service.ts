'use server'

import api from '@/services/api'
import { setAuthToken, getAuthToken, clearAuthToken } from '@/services/auth-token'
import { tryAction } from '@/services/utils'
import { redirect } from 'next/navigation'

export interface LoginCredentials { name: string; password: string }
export interface LoginResponse { access_token: string; user: { id: string; name: string; email: string } }

// Login
export async function loginAction(_: unknown, formData: FormData) {
    const name = formData.get('name') as string
    const password = formData.get('password') as string
    const recaptchaToken = formData.get('recaptchaToken') as string

    if (!name || !password) return { success: false, error: 'Username dan password wajib diisi' }
    if (!recaptchaToken) return { success: false, error: 'Silakan verifikasi reCAPTCHA Anda' }

    const result = await tryAction<LoginResponse>(async () => {
        const res = await api.post<LoginResponse>('/v1/auth/login', { name, password, recaptchaToken })
        await setAuthToken(res.data.access_token)
        return res.data
    }, 'Login gagal')

    if (result.success) redirect('/admin/dashboard')
    return result
}

// Cek auth
export async function checkAuthStatus(): Promise<boolean> {
    return (await getAuthToken()) !== null
}

// Ambil token
export async function getCurrentAuthToken(): Promise<string | null> {
    return getAuthToken()
}
