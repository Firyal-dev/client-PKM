'use server'

import api from '@/services/api'
import { authHeaders } from '@/services/helpers'
import { tryAction, CACHE_TAGS } from '@/services/utils'
import { revalidateTag } from 'next/cache'

// Update profile
export async function updateProfileAction(_: unknown, formData: FormData) {
    const photo = formData.get('photo') as File
    if (!photo || photo.size === 0) formData.delete('photo')

    return tryAction(async () => {
        const res = await api.put('/v1/admin/profile', formData, { headers: await authHeaders() })
        revalidateTag(CACHE_TAGS.PROFILE, 'max')
        return { message: 'Profil berhasil diupdate!', data: res.data }
    }, 'Gagal update profile')
}
