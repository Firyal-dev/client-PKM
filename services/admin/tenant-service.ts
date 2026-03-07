'use server'

import api from '@/services/api'
import { getAuthToken, setAuthToken, setTenantId, clearAuthToken } from '@/services/auth-token'
import { revalidatePath } from 'next/cache'

export async function getTenants() {
    try {
        const res = await api.get('/v1/puskesmas');
        return res.data;
    } catch {
        return [];
    }
}

export async function switchTenant(tenant_id: string | null) {
    const token = await getAuthToken();
    if (!token) return { success: false, message: 'Not authenticated' };

    try {
        const res = await api.post(
            '/v1/auth/switch-tenant',
            { tenant_id },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        await setAuthToken(res.data.access_token);

        // Update tenant ID cookie for API interceptor
        const newTenantId = res.data.user.active_tenant;
        if (newTenantId) {
            await setTenantId(newTenantId);
        } else {
            // If switching to 'all' (global view), clear the tenant cookie
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            cookieStore.delete('tenant_id');
        }

        // Hancurkan semua cache di layout admin biar data di-fetch ulang pakai token baru!
        revalidatePath('/admin', 'layout');

        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to switch tenant'
        };
    }
}
