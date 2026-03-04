"use server"

import api from "@/services/api"
import { authHeaders, buildParams, parseResponse } from "@/services/helpers"
import { tryAction, handleServiceError, CACHE_TAGS, SSG_REVALIDATE_TIME } from "@/services/utils"
import { getBaseUrl } from "@/services/helpers"
import { revalidateTag } from "next/cache"

export interface Video {
    id: string
    video_title: string
    video_desc?: string
    embed: string
    is_embed: boolean
    is_deleted?: boolean
    upload_date?: string
    updated_at?: string
}

// Publik: Ambil videos (paginated)
export async function getPublicVideos(page = 1, limit = 10) {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/video?${buildParams(page, limit)}`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.VIDEO] }
        })
        if (!res.ok) throw new Error('Gagal ambil video')
        const data = await res.json()
        return { data: data.docs || [], totalPages: data.totalPages || 1, currentPage: data.page || page }
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil video')) }
}

// Admin: Ambil videos (paginated)
export async function getAdminVideos(page = 1, limit = 10) {
    try {
        const res = await api.get(`/v1/admin/video?${buildParams(page, limit)}`, { headers: await authHeaders() })
        return parseResponse<Video>(res, page)
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil videos')) }
}

// Admin: Buat video
export async function createVideoAction(_: unknown, formData: FormData) {
    return tryAction(async () => {
        const res = await api.post('/v1/admin/video', formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.VIDEO, 'max')
        return res.data
    }, 'Gagal buat video')
}

// Admin: Hapus video
export async function deleteVideoAction(id: string) {
    return tryAction(async () => {
        const res = await api.delete(`/v1/admin/video/${id}`, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.VIDEO, 'max')
        return res.data
    }, 'Gagal hapus video')
}
