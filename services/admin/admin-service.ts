'use server'

import api from '@/services/api'
import { getAuthToken, requireAuth } from '@/services/auth-token'
import { handleServiceError } from '@/services/utils'
import { AdminProfileProp } from '@/types/admin-profile-prop'

// Ambil profile admin
export async function getAdminProfile(): Promise<AdminProfileProp | null> {
    const token = await getAuthToken()
    if (!token) return null

    try {
        const res = await api.get('/v1/admin/profile', { headers: { Authorization: `Bearer ${token}` } })
        return res.data
    } catch { return null }
}

// Require auth - throw if not authenticated
export async function requireAdminAuth(): Promise<string> {
    return requireAuth()
}
