'use server'

import api from '@/services/api'
import { tryAction, handleServiceError, CACHE_TAGS } from '@/services/utils'
import { buildParams } from '@/services/helpers'
import { authHeaders } from "@/services/server-helpers"

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export interface Puskesmas {
    id: string
    name: string
    slug: string
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'MAINTENANCE'
    created_at: string
    updated_at: string
    // Status tracking fields
    suspended_reason?: string
    suspended_at?: string
    suspended_by?: string
    deactivated_at?: string
    deactivated_by?: string
    deactivated_reason?: string
    activated_at?: string
    activated_by?: string
    maintenance_started_at?: string
    maintenance_message?: string
}

// Admin: Ambil semua puskesmas (paginated)
export async function getAdminPuskesmasList(page = 1, limit = 10) {
    try {
        const res = await api.get(`/v1/puskesmas?${buildParams(page, limit)}`, { headers: await authHeaders() })
        const data = res.data
        return {
            data: data.docs || data || [],
            totalPages: data.totalPages || data.total_pages || 1,
            page: data.page || page,
        }
    } catch (e) {
        console.error('Error fetching puskesmas list:', e)
        return { data: [], totalPages: 1, page: 1 }
    }
}

// Admin: Ambil puskesmas by ID
export async function getAdminPuskesmasById(id: string): Promise<Puskesmas | null> {
    try {
        const res = await api.get(`/v1/puskesmas/${id}`, { headers: await authHeaders() })
        return res.data
    } catch (e) {
        console.error('Error fetching puskesmas by id:', e)
        return null
    }
}

// Admin: Buat puskesmas
export async function createPuskesmasAction(_: unknown, formData: FormData) {
    const result = await tryAction(async () => {
        await api.post('/v1/puskesmas', formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PUSKESMAS, 'max')
    }, 'Gagal buat puskesmas')

    if (result.success) redirect('/admin/puskes')
    return result
}

// Admin: Update puskesmas
export async function updatePuskesmasAction(id: string, _: unknown, formData: FormData) {
    // Convert FormData to JSON object
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const result = await tryAction(async () => {
        await api.patch(`/v1/puskesmas/${id}`, data, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PUSKESMAS, 'max')
    }, 'Gagal update puskesmas')

    if (result.success) redirect('/admin/puskes')
    return result
}

// Admin: Hapus puskesmas
export async function deletePuskesmasAction(id: string) {
    return tryAction(async () => {
        await api.delete(`/v1/puskesmas/${id}`, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PUSKESMAS, 'max')
        return { message: 'Puskesmas berhasil dihapus!' }
    }, 'Gagal hapus puskesmas')
}

// === Tenant Status Management Actions ===

/**
 * Activate a puskesmas (Super Admin only)
 */
export async function activatePuskesmasAction(id: string) {
    return tryAction(async () => {
        await api.patch(`/v1/puskesmas/${id}/activate`, {}, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PUSKESMAS, 'max')
        return { message: 'Puskesmas berhasil diaktifkan!' }
    }, 'Gagal aktivasi puskesmas')
}

/**
 * Deactivate a puskesmas (Super Admin only)
 */
export async function deactivatePuskesmasAction(id: string, reason?: string) {
    return tryAction(async () => {
        await api.patch(`/v1/puskesmas/${id}/deactivate`, { reason }, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PUSKESMAS, 'max')
        return { message: 'Puskesmas berhasil dinonaktifkan!' }
    }, 'Gagal nonaktifkan puskesmas')
}

/**
 * Suspend a puskesmas (Super Admin only)
 */
export async function suspendPuskesmasAction(id: string, reason: string) {
    return tryAction(async () => {
        await api.patch(`/v1/puskesmas/${id}/suspend`, { reason }, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PUSKESMAS, 'max')
        return { message: 'Puskesmas berhasil ditangguhkan!' }
    }, 'Gagal tangguhkan puskesmas')
}

/**
 * Set puskesmas to maintenance mode (Super Admin only)
 */
export async function setMaintenancePuskesmasAction(id: string, message?: string) {
    return tryAction(async () => {
        await api.patch(`/v1/puskesmas/${id}/maintenance`, { message }, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PUSKESMAS, 'max')
        return { message: 'Puskesmas masuk mode maintenance!' }
    }, 'Gagal setting maintenance')
}

/**
 * Remove maintenance mode (Super Admin only)
 */
export async function removeMaintenancePuskesmasAction(id: string) {
    return tryAction(async () => {
        await api.patch(`/v1/puskesmas/${id}/maintenance/remove`, {}, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PUSKESMAS, 'max')
        return { message: 'Mode maintenance dihapus!' }
    }, 'Gagal hapus maintenance')
}
