'use server'

import api from '@/services/api'
import { getAuthToken, requireAuth } from '@/services/auth-token'
import { handleServiceError, CACHE_TAGS } from '@/services/utils'
import { AdminProfileProp } from '@/types/admin-profile-prop'
import { revalidateTag } from 'next/cache'

/**
 * Get current admin profile
 */
export async function getAdminProfile(): Promise<AdminProfileProp | null> {
    const token = await getAuthToken()
    if (!token) {
        return null
    }

    try {
        const response = await api.get('/v1/admin/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        console.error('[AdminService] Failed to fetch profile:', handleServiceError(error, 'Error fetching admin profile'))
        return null
    }
}

/**
 * Require authentication and return token (throws redirect if not authenticated)
 */
export async function requireAdminAuth(): Promise<string> {
    return requireAuth()
}
