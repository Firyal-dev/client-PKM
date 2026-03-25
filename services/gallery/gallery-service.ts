'use server'

import api from '@/services/api'
import { getBaseUrl, buildParams, parseResponse } from '@/services/helpers'
import { authHeaders, getTenantHeader } from '@/services/server-helpers'
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { Gallery } from '@/types/gallery-prop'
import { revalidateTag } from 'next/cache'

// Publik: Ambil gallery (paginated)
export async function getPublicGallery(page = 1, limit = parseInt(process.env.NEXT_PUBLIC_GALLERY_LIMIT || '20'), options?: { albumId?: string; noAlbum?: boolean }) {
    try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        options?.albumId && params.append('album_id', options.albumId)
        options?.noAlbum && params.append('no_album', 'true')

        const res = await fetch(`${getBaseUrl()}/v1/gallery?${params}`, {
            headers: await getTenantHeader(),
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.GALLERY] }
        })
        if (!res.ok) throw new Error('Gagal ambil gallery')
        const result = await res.json()
        const data = result.data || result
        return { data: data.docs || [], totalPages: data.totalPages || 1, currentPage: data.page || page }
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil gallery')) }
}

// Admin: Ambil gallery (paginated)
export async function getAdminGallery(page = 1, limit = parseInt(process.env.NEXT_PUBLIC_GALLERY_LIMIT || '20'), options?: { albumId?: string; noAlbum?: boolean }) {
    try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        options?.albumId && params.append('album_id', options.albumId)
        options?.noAlbum && params.append('no_album', 'true')

        const res = await api.get(`/v1/gallery?${params}`, { headers: await authHeaders() })
        return parseResponse<Gallery>(res, page)
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil gallery')) }
}

// Admin: Upload foto
export async function uploadPhotoAction(_: unknown, formData: FormData) {
    return tryAction(async () => {
        const res = await api.post('/v1/admin/gallery', formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.GALLERY, 'max')
        return res.data
    }, 'Gagal upload foto')
}

// Admin: Hapus banyak foto
export async function deleteGalleryBatchAction(ids: string[]) {
    const headers = await authHeaders()
    return tryAction(async () => {
        await Promise.all(ids.map(id => api.delete(`/v1/admin/gallery/${id}`, { headers })))
        revalidateTag(CACHE_TAGS.GALLERY, 'max')
        return { message: `${ids.length} foto dihapus!` }
    }, 'Gagal hapus foto')
}

// Admin: Hapus satu foto
export async function deleteGalleryPhotoAction(id: string) {
    return tryAction(async () => {
        await api.delete(`/v1/admin/gallery/${id}`, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.GALLERY, 'max')
        return { message: 'Foto dihapus!' }
    }, 'Gagal hapus foto')
}
