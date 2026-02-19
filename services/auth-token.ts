'use server'

import { cookies } from 'next/headers'

// Ambil token
export async function getAuthToken(): Promise<string | null> {
    const store = await cookies()
    return store.get('token')?.value ?? null
}

// Cek auth
export async function isAuthenticated(): Promise<boolean> {
    return (await getAuthToken()) !== null
}

// Require auth - throw jika tidak login
export async function requireAuth(): Promise<string> {
    const token = await getAuthToken()
    if (!token) throw new Error('UNAUTHORIZED')
    return token
}

// Set token cookie
export async function setAuthToken(token: string): Promise<void> {
    const store = await cookies()
    store.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 jam
        path: '/'
    })
}

// Hapus token
export async function clearAuthToken(): Promise<void> {
    const store = await cookies()
    store.delete('token')
}
