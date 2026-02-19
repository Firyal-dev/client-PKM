'use server'

import api from '@/services/api'
import { authHeaders, getBaseUrl, buildParams, parseResponse } from '@/services/helpers'
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { Banner } from '@/types/banner-prop'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

// Publik: Ambil semua banner
export async function getPublicBanners(): Promise<Banner[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/banner`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.BANNER] }
        })
        if (!res.ok) throw new Error('Gagal ambil banner')
        const data: { docs: Banner[] } = await res.json()
        return data.docs || []
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil banner')) }
}

// Admin: Ambil banner (paginated)
export async function getAdminBannerList(page = 1, limit = 10) {
    try {
        const res = await api.get(`/v1/admin/banner?${buildParams(page, limit)}`, { headers: await authHeaders() })
        return parseResponse<Banner>(res, page)
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil banner')) }
}

// Admin: Ambil banner by ID
export async function getAdminBannerById(id: string): Promise<Banner> {
    try {
        const res = await api.get(`/v1/admin/banner/${id}`, { headers: await authHeaders() })
        return res.data
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil banner')) }
}

// Admin: Buat banner
export async function createBannerAction(_: unknown, formData: FormData) {
    const result = await tryAction(async () => {
        await api.post('/v1/admin/banner', formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.BANNER, 'max')
    }, 'Gagal buat banner')

    if (result.success) redirect('/admin/banners')
    return result
}

// Admin: Update banner
export async function updateBannerAction(id: string, _: unknown, formData: FormData) {
    const result = await tryAction(async () => {
        await api.put(`/v1/admin/banner/${id}`, formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.BANNER, 'max')
    }, 'Gagal update banner')

    if (result.success) redirect('/admin/banners')
    return result
}

// Admin: Hapus banner
export async function deleteBannerAction(id: string) {
    return tryAction(async () => {
        await api.delete(`/v1/admin/banner/${id}`, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.BANNER, 'max')
        return { message: 'Banner berhasil dihapus!' }
    }, 'Gagal hapus banner')
}

// Admin: Toggle publish
export async function toggleBannerPublishAction(id: string, isPublish: boolean) {
    return tryAction(async () => {
        await api.put(`/v1/admin/banner/${id}`, { is_publish: isPublish }, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.BANNER, 'max')
        return { message: `Banner ${isPublish ? 'ditampilkan' : 'disembunyikan'}!` }
    }, 'Gagal ubah status')
}
