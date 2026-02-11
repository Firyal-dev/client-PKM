'use server'

import api from '@/services/api'
import { getAuthToken } from '@/services/auth-token'
import { parsePaginatedResponse, tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { Album } from '@/types/album-prop'
import { revalidateTag } from 'next/cache'

// ============================================
// PUBLIC SERVICES (SSG/ISR)
// ============================================

/**
 * Get album list for public users (SSG with ISR)
 */
export async function getPublicAlbums(
    page = 1,
    limit = 10
): Promise<{ data: Album[]; totalPages: number; currentPage: number }> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

    try {
        const response = await fetch(`${baseUrl}/v1/album?page=${page}&limit=${limit}`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.ALBUM] }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch albums')
        }

        const data = await response.json()
        return {
            data: data.docs || [],
            totalPages: data.totalPages || 1,
            currentPage: data.page || page
        }
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil data album'))
    }
}

/**
 * Get single album by ID for public users (SSG)
 */
export async function getPublicAlbumById(id: string): Promise<Album | null> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

    try {
        const response = await fetch(`${baseUrl}/v1/album/${id}`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.ALBUM] }
        })

        if (!response.ok) {
            return null
        }

        return response.json()
    } catch (error) {
        console.error('[AlbumService] Failed to fetch album by ID:', handleServiceError(error, 'Error'))
        return null
    }
}

// ============================================
// ADMIN SERVICES (SSR with Authentication)
// ============================================

/**
 * Get paginated album list for admin (SSR)
 */
export async function getAdminAlbumList(
    page = 1,
    limit = 10
): Promise<{ data: Album[]; totalPages: number; currentPage: number }> {
    const token = await getAuthToken()
    if (!token) {
        throw new Error('UNAUTHORIZED')
    }

    try {
        const response = await api.get(`/v1/admin/album?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return parsePaginatedResponse<Album>(response, page)
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil data album'))
    }
}

/**
 * Get single album by ID for admin (SSR)
 */
export async function getAdminAlbumById(id: string): Promise<Album> {
    const token = await getAuthToken()
    if (!token) {
        throw new Error('UNAUTHORIZED')
    }

    try {
        const response = await api.get(`/v1/admin/album/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
    } catch (error) {
        throw new Error(handleServiceError(error, 'Gagal mengambil detail album'))
    }
}

/**
 * Create new album (Server Action)
 */
export async function createAlbumAction(prevState: unknown, formData: FormData) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    const payload = {
        album_title: formData.get('album_title'),
        description: formData.get('description') || '',
        album_cover: null,
        photo_ids: []
    }

    return tryAction(async () => {
        const response = await api.post('/v1/admin/album', payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Album berhasil dibuat!', data: response.data }
    }, 'Gagal membuat album baru')
}

/**
 * Update album details (Server Action)
 */
export async function updateAlbumAction(id: string, prevState: unknown, formData: FormData) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    const payload = {
        album_title: formData.get('album_title'),
        description: formData.get('description')
    }

    return tryAction(async () => {
        await api.put(`/v1/admin/album/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Album berhasil diperbarui!' }
    }, 'Gagal memperbarui album')
}

/**
 * Delete album (Server Action)
 */
export async function deleteAlbumAction(id: string) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await api.delete(`/v1/admin/album/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Album berhasil dihapus!' }
    }, 'Gagal menghapus album')
}

/**
 * Update album name (Server Action) - Simple name update without FormData
 */
export async function updateAlbumNameAction(id: string, newTitle: string) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await api.put(`/v1/admin/album/${id}`, { album_title: newTitle }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Nama album berhasil diperbarui!' }
    }, 'Gagal mengubah nama album')
}

/**
 * Add photos to album (Server Action)
 */
export async function addPhotosToAlbumAction(albumId: string, photoIds: string[]) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await api.put('/v1/admin/gallery/album', {
            photo_ids: photoIds,
            album_id: albumId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Foto berhasil ditambahkan ke album!' }
    }, 'Gagal menambahkan foto ke album')
}

/**
 * Remove photos from album (Server Action)
 */
export async function removePhotosFromAlbumAction(albumId: string, photoIds: string[]) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    return tryAction(async () => {
        await api.put('/v1/admin/gallery/remove-from-album', {
            photo_ids: photoIds,
            album_id: albumId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Foto berhasil dihapus dari album!' }
    }, 'Gagal menghapus foto dari album')
}
