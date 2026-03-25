import { getBaseUrl } from './helpers'
import { getTenantHeader } from './server-helpers'

export type TenantStatus = 'ACTIVE' | 'MAINTENANCE' | 'SUSPENDED' | 'INACTIVE'

export interface TenantStatusInfo {
    status: TenantStatus
    name: string
    message?: string
}

/**
 * Check tenant status - used by frontend to determine if redirect is needed
 */
export async function checkTenantStatus(tenantSlug: string): Promise<TenantStatusInfo | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/puskesmas/status/${tenantSlug}`, {
            headers: await getTenantHeader(),
            next: { revalidate: 0 } // Always get fresh status
        })

        if (!res.ok) return null

        const result = await res.json()
        return result.data || result
    } catch (e) {
        console.error('[checkTenantStatus] Error:', e)
        return null
    }
}

/**
 * Check if tenant requires special page display (can be used on client too)
 * Returns: 'normal' | 'maintenance' | 'suspended' | 'inactive'
 */
export function getTenantPageType(status?: string): 'normal' | 'maintenance' | 'suspended' | 'inactive' {
    if (!status) return 'normal'

    switch (status) {
        case 'MAINTENANCE':
            return 'maintenance'
        case 'SUSPENDED':
            return 'suspended'
        case 'INACTIVE':
            return 'inactive'
        default:
            return 'normal'
    }
}
