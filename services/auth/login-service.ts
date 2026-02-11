'use server'

import api from '@/services/api'
import { setAuthToken, getAuthToken, clearAuthToken } from '@/services/auth-token'
import { tryAction } from '@/services/utils'
import { redirect } from 'next/navigation'

/**
 * Login credentials interface
 */
export interface LoginCredentials {
    name: string
    password: string
}

/**
 * Login response interface
 */
export interface LoginResponse {
    access_token: string
    user: {
        id: string
        name: string
        email: string
    }
}

/**
 * Handle user login (Server Action)
 */
export async function loginAction(prevState: unknown, formData: FormData) {
    const name = formData.get('name') as string
    const password = formData.get('password') as string

    if (!name || !password) {
        return { success: false, error: 'Username dan password wajib diisi' }
    }

    const result = await tryAction<LoginResponse>(async () => {
        const response = await api.post<LoginResponse>('/v1/auth/login', { name, password })
        await setAuthToken(response.data.access_token)
        return response.data
    }, 'Login gagal')

    if (result.success) {
        redirect('/admin/dashboard')
    }

    return result
}

/**
 * Check if user is authenticated
 */
export async function checkAuthStatus(): Promise<boolean> {
    return (await getAuthToken()) !== null
}

/**
 * Get current auth token
 */
export async function getCurrentAuthToken(): Promise<string | null> {
    return getAuthToken()
}
