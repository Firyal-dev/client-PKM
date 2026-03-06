// services/server-helpers.ts
'use server'

import { headers } from 'next/headers'
import { getAuthToken } from '@/services/auth-token'

export async function getTenantHeader(): Promise<{ 'x-tenant-slug': string; 'Content-Type': string }> {
    try {
        const headersList = await headers() // Hanya bekerja di Server Component
        const tenantSlug = headersList.get('x-tenant-slug') || 'default'

        return {
            'x-tenant-slug': String(tenantSlug),
            'Content-Type': 'application/json'
        }
    } catch (error) {
        return {
            'x-tenant-slug': 'default',
            'Content-Type': 'application/json'
        }
    }
}

// Get tenant ID from JWT token (for admin operations)
async function getJwtTenantId(): Promise<string | null> {
    try {
        const token = await getAuthToken()
        if (!token) return null

        // Decode JWT to get active_tenant
        const parts = token.split('.')
        if (parts.length !== 3) return null

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
        return payload.active_tenant || null
    } catch (e) {
        return null
    }
}

export async function authHeaders() {
    const { getAuthToken } = await import('@/services/auth-token')
    const token = await getAuthToken()
    if (!token) throw new Error('UNAUTHORIZED')

    // For admin operations, check if user has switched tenant in JWT
    const jwtTenantId = await getJwtTenantId()

    // Get tenant from URL header (set by proxy)
    const tenantHeaders = await getTenantHeader()

    // Use JWT tenant ID if available (Super Admin switched tenant), otherwise use URL tenant slug
    // The backend will handle both x-tenant-id (UUID) and x-tenant-slug
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }

    // If Super Admin has switched to a specific tenant, use the ID
    if (jwtTenantId) {
        headers['x-tenant-id'] = jwtTenantId
    } else {
        headers['x-tenant-slug'] = tenantHeaders['x-tenant-slug']
    }

    return headers
}
