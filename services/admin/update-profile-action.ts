'use server'

import api from '@/services/api'
import { getAuthToken } from '@/services/auth-token'
import { tryAction, CACHE_TAGS } from '@/services/utils'
import { revalidateTag } from 'next/cache'

/**
 * Update admin profile (server action)
 */
export async function updateProfileAction(prevState: unknown, formData: FormData) {
    const token = await getAuthToken()
    if (!token) {
        return { success: false, error: 'Sesi habis, silakan login lagi' }
    }

    const photo = formData.get('photo') as File
    if (!photo || photo.size === 0) {
        formData.delete('photo')
    }

    return tryAction(async () => {
        const response = await api.put('/v1/admin/profile', formData, {
            headers: { Authorization: `Bearer ${token}` }
        })

        revalidateTag(CACHE_TAGS.PROFILE as string, 'profile')
        return { message: 'Profil berhasil diupdate!', data: response.data }
    }, 'Gagal update profile ke server')
}
