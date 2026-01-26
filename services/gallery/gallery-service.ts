'use server'

import api from "@/services/api"
import { cookies } from "next/headers"

export const uploadPhoto = async (prevState: any, data: FormData) => {
    const token = (await cookies()).get("token")?.value

    const name = data.get('image_title')
    const image = data.get('image')

    if (!name || !image) {
        return { message: 'Semua field wajib diisi' }
    }

    try {
        const response = await api.post('/v1/admin/gallery/upload-photo', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error: any) {
        return {
            error: error?.response?.data?.message || "Gagal mengunggah foto"
        }
    }
}