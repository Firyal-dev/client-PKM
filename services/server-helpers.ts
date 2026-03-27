// services/server-helpers.ts
'use server'

import { headers, cookies } from 'next/headers'
import { getAuthToken, getTenantId } from '@/services/auth-token'

export async function getTenantHeader(): Promise<Record<string, string>> {
    try {
        // Get headers from Next.js (server-side)
        const headersList = await headers()

        // 1. First check x-tenant-slug header (set by proxy middleware)
        let tenantSlug = headersList.get('x-tenant-slug') || 'default'
        let urlPathname = headersList.get('x-url-pathname') || ''

        console.log('[getTenantHeader] Final tenantSlug:', tenantSlug, 'Path:', urlPathname)

        // Also check cookie for tenant ID (set by tenant switcher)
        const cookieStore = await cookies()
        const cookieTenantId = cookieStore.get('tenant_id')?.value

        const result: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-url-pathname': urlPathname
        };

        // Priority: use tenant slug from headers/hostname if available, otherwise use tenant ID from cookie
        if (tenantSlug && tenantSlug !== 'default') {
            result['x-tenant-slug'] = String(tenantSlug);
        } else if (cookieTenantId) {
            // Use tenant ID from cookie
            result['x-tenant-id'] = cookieTenantId;
        } else {
            result['x-tenant-slug'] = 'default';
        }

        return result;
    } catch (error) {
        // Try to get tenant ID from cookie as fallback
        try {
            const cookieStore = await cookies()
            const cookieTenantId = cookieStore.get('tenant_id')?.value
            if (cookieTenantId) {
                return {
                    'x-tenant-id': cookieTenantId,
                    'Content-Type': 'application/json'
                };
            }
        } catch (e) {
            // Cookies not available
        }
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

// Get role from JWT token
async function getJwtRole(): Promise<string | null> {
    try {
        const token = await getAuthToken()
        if (!token) return null

        // Decode JWT to get role
        const parts = token.split('.')
        if (parts.length !== 3) return null

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
        return payload.role || null
    } catch (e) {
        return null
    }
}

export async function authHeaders() {
    const { getAuthToken } = await import('@/services/auth-token')
    const token = await getAuthToken()
    if (!token) throw new Error('UNAUTHORIZED')

    // Get role from JWT
    const jwtRole = await getJwtRole()

    // For admin operations, check if user has switched tenant in JWT
    const jwtTenantId = await getJwtTenantId()

    // Also check cookie for tenant ID (set by tenant switcher)
    const cookieStore = await cookies()
    const cookieTenantId = cookieStore.get('tenant_id')?.value

    // Get tenant from URL header (set by proxy) or extract from host
    const tenantHeaders = await getTenantHeader()

    // Use JWT tenant ID if available (Super Admin switched tenant), otherwise use cookie, otherwise use URL tenant slug
    // The backend will handle both x-tenant-id (UUID) and x-tenant-slug
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }

    // SUPER_ADMIN without active_tenant (viewing all) should NOT send tenant headers
    // This allows them to access global resources like all puskesmas
    if (jwtRole === 'SUPER_ADMIN' && !jwtTenantId && !cookieTenantId) {
        // Don't add tenant headers - allow global access for SUPER_ADMIN
        return headers
    }

    // Priority: JWT tenant ID > Cookie tenant ID > URL header/hostname
    if (jwtTenantId) {
        headers['x-tenant-id'] = jwtTenantId
    } else if (cookieTenantId) {
        headers['x-tenant-id'] = cookieTenantId
    } else if (tenantHeaders['x-tenant-slug'] && tenantHeaders['x-tenant-slug'] !== 'default') {
        headers['x-tenant-slug'] = tenantHeaders['x-tenant-slug']
    }

    return headers
}
