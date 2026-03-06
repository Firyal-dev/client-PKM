'use server'

import api from '@/services/api'
import { getAuthToken, setAuthToken } from '@/services/auth-token'
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
