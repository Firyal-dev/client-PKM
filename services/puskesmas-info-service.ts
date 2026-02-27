'use server'

import api from '@/services/api'
import { authHeaders, getBaseUrl } from '@/services/helpers'
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { PuskesmasInfo } from '@/types/web-info'
import { revalidateTag } from 'next/cache'

// Publik: Ambil info puskesmas
export async function getPublicPuskesmasInfo(): Promise<PuskesmasInfo | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/public/puskesmas-info`, {
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.WEB_INFO] }
        })
        if (!res.ok) return null
        return await res.json()
    } catch (e) {
        console.error(handleServiceError(e, 'Gagal ambil info puskesmas'))
        return null
    }
}

// Admin: Ambil info puskesmas
export async function getAdminPuskesmasInfo(): Promise<PuskesmasInfo> {
    try {
        const res = await api.get('/v1/admin/puskesmas-info', { headers: await authHeaders() })
        return res.data
    } catch (e) { throw new Error(handleServiceError(e, 'Gagal ambil info puskesmas')) }
}

// Admin: Update info puskesmas
export async function updatePuskesmasInfoAction(_: unknown, formData: FormData) {
    return await tryAction(async () => {
        // Build social_links JSON
        const social_links = {
            facebook: formData.get('fb'),
            instagram: formData.get('ig'),
            twitter: formData.get('tw'),
            youtube: formData.get('yt'),
        }

        // Remove individual fields and add combined JSON
        formData.delete('fb')
        formData.delete('ig')
        formData.delete('tw')
        formData.delete('yt')
        formData.set('social_links', JSON.stringify(social_links))

        await api.put('/v1/admin/puskesmas-info', formData, {
            headers: {
                ...(await authHeaders()),
                'Content-Type': 'multipart/form-data'
            }
        })
        revalidateTag(CACHE_TAGS.WEB_INFO, 'max')
        return { message: 'Informasi Puskesmas berhasil diperbarui!' }
    }, 'Gagal memperbarui informasi')
}
