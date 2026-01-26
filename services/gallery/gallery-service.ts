'use server'

import api from "@/services/api"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Gallery } from "@/types/gallery-card-prop"

export const uploadPhoto = async (prevState: any, data: FormData) => {
    const token = (await cookies()).get("token")?.value

    const name = data.get('image_title')
    const image = data.get('image')

    if (!name || !image) {
        return { message: 'Semua field wajib diisi' }
    }

    let isSuccess = false;

    try {
        await api.post('/v1/admin/gallery/upload-photo', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        isSuccess = true;
    } catch (error: any) {
        return {
            error: error?.response?.data?.message || "Gagal mengunggah foto"
        }
    }

    if (isSuccess) {
        redirect('/admin/gallery')
    }
}

export const getGallery = async (): Promise<Gallery[]> => {
    try {
        const response = await api.get('/v1/admin/gallery')
        return response.data
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal mengambil data admin")
    }
}