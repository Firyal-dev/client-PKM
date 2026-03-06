"use server"

import api from "@/services/api"
import { getBaseUrl, buildParams, parseResponse } from "@/services/helpers"
import { authHeaders, getTenantHeader } from '@/services/server-helpers'
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from "@/services/utils"
import { Berita } from "@/types/berita-prop"
import { revalidateTag } from "next/cache"

// Publik: Ambil berita (paginated)
export async function getPublicNews(page = 1, limit = 12) {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/news?${buildParams(page, limit)}`, {
            headers: await getTenantHeader(),
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.NEWS] }
        })
        if (!res.ok) throw new Error('Gagal ambil berita')
        const data = await res.json()
        return { data: data.docs || [], totalPages: data.totalPages || 1, currentPage: data.page || page }
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil berita')) }
}

// Publik: Ambil berita by ID
export async function getPublicNewsById(id: string): Promise<Berita> {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/news/${id}`, {
            headers: await getTenantHeader(),
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.NEWS] }
        })
        if (!res.ok) throw new Error('Gagal ambil berita')
        return await res.json()
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil berita')) }
}

// Admin: Ambil berita (paginated)
export async function getAdminNews(page = 1, limit = 12) {
    try {
        const res = await api.get(`/v1/news?${buildParams(page, limit)}`, { headers: await authHeaders() })
        return parseResponse<Berita>(res, page)
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil berita')) }
}

// Admin: Ambil berita by ID
export async function getAdminNewsById(id: string): Promise<Berita> {
    try {
        const res = await api.get(`/v1/admin/news/${id}`, { headers: await authHeaders() })
        return res.data
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil berita')) }
}

// Admin: Buat berita
export async function createNewsAction(_: unknown, formData: FormData) {
    const photo = formData.get('image') as File
    if (!photo || photo.size === 0) formData.delete('image')

    return tryAction(async () => {
        const res = await api.post('/v1/admin/news', formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.NEWS, 'max')
        return res.data
    }, 'Gagal buat berita')
}

// Admin: Update berita
export async function updateNewsAction(id: string, _: unknown, formData: FormData) {
    const photo = formData.get('image') as File
    if (!photo || photo.size === 0) formData.delete('image')

    return tryAction(async () => {
        const res = await api.put(`/v1/admin/news/${id}`, formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.NEWS, 'max')
        return res.data
    }, 'Gagal update berita')
}

// Admin: Hapus berita
export async function deleteNewsAction(id: string) {
    return tryAction(async () => {
        const res = await api.delete(`/v1/admin/news/${id}`, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.NEWS, 'max')
        return res.data
    }, 'Gagal hapus berita')
}
