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
    alamat?: string
    logo_path?: string
    primary_color?: string
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
    created_at: string
    updated_at: string
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
        revalidateTag(CACHE_TAGS.PUSKESMAS)
    }, 'Gagal buat puskesmas')

    if (result.success) redirect('/admin/puskesmas')
    return result
}

// Admin: Update puskesmas
export async function updatePuskesmasAction(id: string, _: unknown, formData: FormData) {
    const result = await tryAction(async () => {
        await api.patch(`/v1/puskesmas/${id}`, formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PUSKESMAS)
    }, 'Gagal update puskesmas')

    if (result.success) redirect('/admin/puskesmas')
    return result
}

// Admin: Hapus puskesmas
export async function deletePuskesmasAction(id: string) {
    return tryAction(async () => {
        await api.delete(`/v1/puskesmas/${id}`, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PUSKESMAS)
        return { message: 'Puskesmas berhasil dihapus!' }
    }, 'Gagal hapus puskesmas')
}
