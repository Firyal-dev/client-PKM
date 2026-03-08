'use server'

import api from '@/services/api'
import { getBaseUrl, buildParams, parseResponse } from '@/services/helpers'
import { authHeaders, getTenantHeader } from '@/services/server-helpers'
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { Album } from '@/types/album-prop'
import { revalidateTag } from 'next/cache'

// Publik: Ambil album (paginated)
export async function getPublicAlbums(page = 1, limit = 10) {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/album?${buildParams(page, limit)}`, {
            headers: await getTenantHeader(),
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.ALBUM] }
        })
        if (!res.ok) throw new Error('Gagal ambil album')
        const data = await res.json()
        return { data: data.docs || [], totalPages: data.totalPages || 1, currentPage: data.page || page }
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil album')) }
}

// Publik: Ambil album by ID
export async function getPublicAlbumById(id: string): Promise<Album | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/album/${id}`, {
            headers: await getTenantHeader(),
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.ALBUM] }
        })
        return res.ok ? await res.json() : null
    } catch { return null }
}

// Admin: Ambil album (paginated)
export async function getAdminAlbumList(page = 1, limit = 10, search = "", filter = "all") {
    try {
        const extras: Record<string, string> = {}
        if (search) extras.search = search
        if (filter && filter !== "all") extras.status = filter
        const res = await api.get(`/v1/admin/album?${buildParams(page, limit, extras)}`, { headers: await authHeaders() })
        return parseResponse<Album>(res, page)
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil album')) }
}

// Admin: Ambil album by ID
export async function getAdminAlbumById(id: string): Promise<Album> {
    try {
        const res = await api.get(`/v1/admin/album/${id}`, { headers: await authHeaders() })
        return res.data
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil album')) }
}

// Admin: Buat album
export async function createAlbumAction(_: unknown, formData: FormData) {
    const payload = {
        album_title: formData.get('album_title'),
        description: formData.get('description') || '',
        album_cover: null,
        photo_ids: []
    }
    return tryAction(async () => {
        const res = await api.post('/v1/admin/album', payload, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Album berhasil dibuat!', data: res.data }
    }, 'Gagal buat album')
}

// Admin: Update album
export async function updateAlbumAction(id: string, _: unknown, formData: FormData) {
    const payload = { album_title: formData.get('album_title'), description: formData.get('description') }
    return tryAction(async () => {
        await api.patch(`/v1/admin/album/${id}`, payload, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Album berhasil diperbarui!' }
    }, 'Gagal update album')
}

// Admin: Hapus album
export async function deleteAlbumAction(id: string) {
    return tryAction(async () => {
        await api.delete(`/v1/admin/album/${id}`, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Album berhasil dihapus!' }
    }, 'Gagal hapus album')
}

// Admin: Update nama album
export async function updateAlbumNameAction(id: string, newTitle: string) {
    return tryAction(async () => {
        await api.patch(`/v1/admin/album/${id}`, { album_title: newTitle }, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Nama album berhasil diperbarui!' }
    }, 'Gagal ubah nama album')
}

// Admin: Tambah foto ke album
export async function addPhotosToAlbumAction(albumId: string, photoIds: string[]) {
    return tryAction(async () => {
        await api.patch('/v1/admin/gallery/album', { photo_ids: photoIds, album_id: albumId }, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Foto berhasil ditambahkan!' }
    }, 'Gagal tambah foto')
}

// Admin: Hapus foto dari album
export async function removePhotosFromAlbumAction(albumId: string, photoIds: string[]) {
    return tryAction(async () => {
        await api.patch('/v1/admin/gallery/remove-from-album', { photo_ids: photoIds, album_id: albumId }, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.ALBUM, 'max')
        return { message: 'Foto berhasil dihapus!' }
    }, 'Gagal hapus foto')
}
