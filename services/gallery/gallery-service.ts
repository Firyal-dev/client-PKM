'use server'

import api from '@/services/api'
import { getAuthToken } from '@/services/auth-token'
import { parsePaginatedResponse, tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { Gallery } from '@/types/gallery-prop'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

// ============================================
// PUBLIC SERVICES (SSG/ISR)
// ============================================

/**
 * Get gallery photos for public users (SSG with ISR)
 */
export async function getPublicGallery(
    page = 1,
    limit = 20,
    options?: { albumId?: string; noAlbum?: boolean }
): Promise<{ data: Gallery[]; totalPages: number; currentPage: number }> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        })

        if (options?.albumId) {
            params.append('album_id', options.albumId)
        }
        if (options?.noAlbum) {
            params.append('no_album', 'true')
        }

        const response = await fetch(`${baseUrl}/v1/gallery?${params.toString()}`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.GALLERY] }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch gallery')
        }

        const data = await response.json()
        return {
            data: data.docs || [],
            totalPages: data.totalPages || 1,
            currentPage: data.page || page
        }
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil data gallery'))
    }
}

// ============================================
// ADMIN SERVICES (SSR with Authentication)
// ============================================

/**
 * Get gallery photos for admin with filters (SSR)
 */
export async function getAdminGallery(
    page = 1,
    limit = 20,
    options?: { albumId?: string; noAlbum?: boolean }
): Promise<{ data: Gallery[]; totalPages: number; currentPage: number }> {
    const token = await getAuthToken()
    if (!token) {
        throw new Error('UNAUTHORIZED')
    }

    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        })

        if (options?.albumId) {
            params.append('album_id', options.albumId)
        }
        if (options?.noAlbum) {
            params.append('no_album', 'true')
        }

        const response = await api.get(`/v1/gallery?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return parsePaginatedResponse<Gallery>(response, page)
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil data gallery'))
    }
}

/**
 * Upload photo to gallery (Server Action)
 */
export async function uploadPhotoAction(prevState: unknown, formData: FormData) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        const response = await api.post('/v1/admin/gallery', formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.GALLERY, 'max')
        return response.data
    }, 'Gagal mengunggah foto')
}

/**
 * Delete multiple gallery photos (Server Action)
 */
export async function deleteGalleryBatchAction(ids: string[]) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await Promise.all(
            ids.map((id) =>
                api.delete(`/v1/admin/gallery/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            )
        )
        revalidateTag(CACHE_TAGS.GALLERY, 'max')
        return { message: `${ids.length} foto berhasil dihapus!` }
    }, 'Gagal menghapus foto')
}

/**
 * Delete single gallery photo (Server Action)
 */
export async function deleteGalleryPhotoAction(id: string) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await api.delete(`/v1/admin/gallery/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.GALLERY, 'max')
        return { message: 'Foto berhasil dihapus!' }
    }, 'Gagal menghapus foto')
}
