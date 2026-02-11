'use server'

import api from '@/services/api'
import { getAuthToken } from '@/services/auth-token'
import { parsePaginatedResponse, tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { Reviews } from '@/types/review-prop'
import { revalidateTag } from 'next/cache'

// ============================================
// PUBLIC SERVICES (SSG/ISR)
// ============================================

/**
 * Get reviews for public users (SSG with ISR)
 */
export async function getPublicReviews(
    page = 1,
    limit = 10
): Promise<{ data: Reviews[]; totalPages: number; currentPage: number }> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

    try {
        const response = await fetch(`${baseUrl}/v1/reviews?page=${page}&limit=${limit}`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.REVIEW] }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch reviews')
        }

        const data = await response.json()
        return {
            data: data.docs || [],
            totalPages: data.totalPages || 1,
            currentPage: data.page || page
        }
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil data ulasan'))
    }
}

/**
 * Create review (public user)
 */
export async function createReviewAction(data: Omit<Reviews, 'id' | 'created_at'>) {
    // Public endpoint, no auth required
    return tryAction(async () => {
        await api.post('/v1/reviews', data)
        revalidateTag(CACHE_TAGS.REVIEW, 'max')
        return { message: 'Ulasan berhasil dikirim!' }
    }, 'Gagal membuat ulasan')
}

// ============================================
// ADMIN SERVICES (SSR with Authentication)
// ============================================

/**
 * Get paginated review list for admin (SSR)
 */
export async function getAdminReviewList(
    page = 1,
    limit = 10
): Promise<{ data: Reviews[]; totalPages: number; currentPage: number }> {
    const token = await getAuthToken()
    if (!token) {
        throw new Error('UNAUTHORIZED')
    }

    try {
        const response = await api.get(`/v1/admin/reviews?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return parsePaginatedResponse<Reviews>(response, page)
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil data ulasan'))
    }
}

/**
 * Update review publish status (Server Action)
 */
export async function toggleReviewPublishAction(id: string, isPublish: boolean) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await api.put(`/v1/admin/reviews/${id}`, { is_publish: isPublish }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.REVIEW, 'max')
        return { message: `Ulasan ${isPublish ? 'ditampilkan' : 'disembunyikan'}!` }
    }, 'Gagal mengubah status ulasan')
}

/**
 * Delete review (Server Action)
 */
export async function deleteReviewAction(id: string) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await api.delete(`/v1/admin/reviews/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.REVIEW, 'max')
        return { message: 'Ulasan berhasil dihapus!' }
    }, 'Gagal menghapus ulasan')
}
