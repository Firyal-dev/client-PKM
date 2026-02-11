'use server'

import api from '@/services/api'
import { getAuthToken } from '@/services/auth-token'
import { parsePaginatedResponse, tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { Banner } from '@/types/banner-prop'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

// ============================================
// PUBLIC SERVICES (SSG/ISR)
// ============================================

/**
 * Get banners for public users (SSG with ISR)
 */
export async function getPublicBanners(): Promise<Banner[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

    try {
        const response = await fetch(`${baseUrl}/v1/banner`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.BANNER] }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch banners')
        }

        const data: { docs: Banner[] } = await response.json()
        return data.docs || []
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil data banner'))
    }
}

// ============================================
// ADMIN SERVICES (SSR with Authentication)
// ============================================

/**
 * Get paginated banner list for admin (SSR)
 */
export async function getAdminBannerList(
    page = 1,
    limit = 10
): Promise<{ data: Banner[]; totalPages: number; currentPage: number }> {
    const token = await getAuthToken()
    if (!token) {
        throw new Error('UNAUTHORIZED')
    }

    try {
        const response = await api.get(`/v1/admin/banner?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return parsePaginatedResponse<Banner>(response, page)
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil data banner'))
    }
}

/**
 * Get single banner by ID for admin (SSR)
 */
export async function getAdminBannerById(id: string): Promise<Banner> {
    const token = await getAuthToken()
    if (!token) {
        throw new Error('UNAUTHORIZED')
    }

    try {
        const response = await api.get(`/v1/admin/banner/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil detail banner'))
    }
}

/**
 * Create new banner (Server Action)
 */
export async function createBannerAction(prevState: unknown, formData: FormData) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    const result = await tryAction(async () => {
        await api.post('/v1/admin/banner', formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.BANNER, 'max')
    }, 'Gagal membuat banner baru')

    if (result.success) {
        redirect('/admin/banners')
    }

    return result
}

/**
 * Update existing banner (Server Action)
 */
export async function updateBannerAction(id: string, prevState: unknown, formData: FormData) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    const result = await tryAction(async () => {
        await api.put(`/v1/admin/banner/${id}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.BANNER, 'max')
    }, 'Gagal memperbarui banner')

    if (result.success) {
        redirect('/admin/banners')
    }

    return result
}

/**
 * Delete banner (Server Action)
 */
export async function deleteBannerAction(id: string) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await api.delete(`/v1/admin/banner/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.BANNER, 'max')
        return { message: 'Banner berhasil dihapus!' }
    }, 'Gagal menghapus banner')
}

/**
 * Toggle banner publish status (Server Action)
 */
export async function toggleBannerPublishAction(id: string, isPublish: boolean) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await api.put(`/v1/admin/banner/${id}`, { is_publish: isPublish }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.BANNER, 'max')
        return { message: `Banner ${isPublish ? 'ditampilkan' : 'disembunyikan'}!` }
    }, 'Gagal mengubah status banner')
}
