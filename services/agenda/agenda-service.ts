'use server'

import api from '@/services/api'
import { getAuthToken } from '@/services/auth-token'
import { parsePaginatedResponse, tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { Agenda } from '@/types/agenda-prop'
import { revalidateTag } from 'next/cache'

// ============================================
// PUBLIC SERVICES (SSG/ISR)
// ============================================

/**
 * Get agenda list for public users (SSG with ISR)
 */
export async function getPublicAgenda(
    page = 1,
    limit = 10
): Promise<{ data: Agenda[]; totalPages: number; currentPage: number }> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

    try {
        const response = await fetch(`${baseUrl}/v1/agenda?page=${page}&limit=${limit}`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.AGENDA] }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch agenda')
        }

        const data = await response.json()
        return {
            data: data.docs || [],
            totalPages: data.totalPages || 1,
            currentPage: data.page || page
        }
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil data agenda'))
    }
}

/**
 * Get single agenda by slug or ID (SSG)
 */
export async function getPublicAgendaBySlug(slug: string): Promise<Agenda | null> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

    try {
        const response = await fetch(`${baseUrl}/v1/agenda/${slug}`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.AGENDA] }
        })

        if (!response.ok) {
            return null
        }

        return response.json()
    } catch (error) {
        console.error('[AgendaService] Failed to fetch agenda by slug:', handleServiceError(error, 'Error'))
        return null
    }
}

// ============================================
// ADMIN SERVICES (SSR with Authentication)
// ============================================

/**
 * Get paginated agenda list for admin (SSR)
 */
export async function getAdminAgendaList(
    page = 1,
    limit = 10
): Promise<{ data: Agenda[]; totalPages: number; currentPage: number }> {
    const token = await getAuthToken()
    if (!token) {
        throw new Error('UNAUTHORIZED')
    }

    try {
        const response = await api.get(`/v1/admin/agenda?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return parsePaginatedResponse<Agenda>(response, page)
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil data agenda'))
    }
}

/**
 * Get single agenda by ID for admin (SSR)
 */
export async function getAdminAgendaById(id: string): Promise<Agenda> {
    const token = await getAuthToken()
    if (!token) {
        throw new Error('UNAUTHORIZED')
    }

    try {
        const response = await api.get(`/v1/admin/agenda/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil detail agenda'))
    }
}

/**
 * Create new agenda (Server Action)
 */
export async function createAgendaAction(prevState: unknown, formData: FormData) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    const payload = {
        activity_name: formData.get("activity_name") as string,
        date: formData.get("date") as string,
        effective_date: formData.get("effective_date") as string,
        time: formData.get("time") as string,
        location: formData.get("location") as string,
    }

    return tryAction(async () => {
        const response = await api.post('/v1/admin/agenda', payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.AGENDA, 'max')
        return response.data 
    }, 'Gagal membuat agenda')
}

/**
 * Update existing agenda (Server Action)
 */
export async function updateAgendaAction(id: string, prevState: unknown, formData: FormData) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    const payload = {
        activity_name: formData.get("activity_name") as string,
        date: formData.get("date") as string,
        effective_date: formData.get("effective_date") as string,
        time: formData.get("time") as string,
        location: formData.get("location") as string,
    }

    return tryAction(async () => {
        const response = await api.put(`/v1/admin/agenda/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.AGENDA, 'max')
        return { message: 'Agenda berhasil diperbarui!', data: response.data }
    }, 'Gagal memperbarui agenda')
}

/**
 * Delete agenda (Server Action)
 */
export async function deleteAgendaAction(id: string) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await api.delete(`/v1/admin/agenda/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.AGENDA, 'max')
        return { message: 'Agenda berhasil dihapus!' }
    }, 'Gagal menghapus agenda')
}
