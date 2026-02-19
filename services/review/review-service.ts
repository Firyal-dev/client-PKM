'use server'

import api from '@/services/api'
import { authHeaders, getBaseUrl, buildParams, parseResponse } from '@/services/helpers'
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { Reviews } from '@/types/review-prop'
import { revalidateTag } from 'next/cache'

// Publik: Ambil review (paginated)
export async function getPublicReviews(page = 1, limit = 10) {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/reviews?${buildParams(page, limit)}`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.REVIEW] }
        })
        if (!res.ok) throw new Error('Gagal ambil review')
        const data = await res.json()
        return { data: data.docs || [], totalPages: data.totalPages || 1, currentPage: data.page || page }
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil review')) }
}

// Publik: Buat review
export async function createReviewAction(data: Omit<Reviews, 'id' | 'created_at'>) {
    return tryAction(async () => {
        await api.post('/v1/reviews', data)
        revalidateTag(CACHE_TAGS.REVIEW, 'max')
        return { message: 'Ulasan dikirim!' }
    }, 'Gagal buat ulasan')
}

// Admin: Ambil review (paginated)
export async function getAdminReviewList(page = 1, limit = 10) {
    try {
        const res = await api.get(`/v1/admin/reviews?${buildParams(page, limit)}`, { headers: await authHeaders() })
        return parseResponse<Reviews>(res, page)
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil review')) }
}

// Admin: Toggle publish
export async function toggleReviewPublishAction(id: string, isPublish: boolean) {
    return tryAction(async () => {
        await api.put(`/v1/admin/reviews/${id}`, { is_publish: isPublish }, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.REVIEW, 'max')
        return { message: `Ulasan ${isPublish ? 'ditampilkan' : 'disembunyikan'}!` }
    }, 'Gagal ubah status')
}

// Admin: Hapus review
export async function deleteReviewAction(id: string) {
    return tryAction(async () => {
        await api.delete(`/v1/admin/reviews/${id}`, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.REVIEW, 'max')
        return { message: 'Ulasan dihapus!' }
    }, 'Gagal hapus ulasan')
}
