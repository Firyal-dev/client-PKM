'use server'

import api from '@/services/api'
import { getBaseUrl } from '@/services/helpers'
import { authHeaders, getTenantHeader } from '@/services/server-helpers'
import { tryAction, handleServiceError, SSG_REVALIDATE_TIME, CACHE_TAGS } from '@/services/utils'
import { PuskesmasInfo } from '@/types/web-info'
import { revalidateTag } from 'next/cache'

// Publik: Ambil info puskesmas
export async function getPublicPuskesmasInfo(): Promise<PuskesmasInfo | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/v1/public/puskesmas-info`, {
            headers: await getTenantHeader(),
            next: { revalidate: SSG_REVALIDATE_TIME, tags: [CACHE_TAGS.WEB_INFO] }
        })
        if (!res.ok) return null
        const result = await res.json()
        return result.data || result
    } catch {
        // Silent fail - web info is non-critical
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
        // Handle logo file
        const logo = formData.get('logo') as File
        if (!logo || logo.size === 0) formData.delete('logo')

        // Handle kepala_foto file
        const kepala_foto = formData.get('kepala_foto') as File
        if (!kepala_foto || kepala_foto.size === 0) formData.delete('kepala_foto')

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

        await api.patch('/v1/admin/puskesmas-info', formData, {
            headers: await authHeaders()
        })
        revalidateTag(CACHE_TAGS.WEB_INFO, 'max')
        return { message: 'Informasi Puskesmas berhasil diperbarui!' }
    }, 'Gagal memperbarui informasi')
}
