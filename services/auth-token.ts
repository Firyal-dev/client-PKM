'use server'

import { cookies } from 'next/headers'

/**
 * Centralized token helper for all services
 */
export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get('token')?.value ?? null
}

/**
 * Check if user is authenticated (has valid token)
 */
export async function isAuthenticated(): Promise<boolean> {
    return (await getAuthToken()) !== null
}

/**
 * Require authentication - throws redirect if not authenticated
 */
export async function requireAuth(): Promise<string> {
    const token = await getAuthToken()
    if (!token) {
        throw new Error('UNAUTHORIZED')
    }
    return token
}

/**
 * Set auth token cookie
 */
export async function setAuthToken(token: string): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/'
    })
}

/**
 * Clear auth token cookie
 */
export async function clearAuthToken(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete('token')
}
