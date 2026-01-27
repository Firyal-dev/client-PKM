'use server'

import api from "@/services/api"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
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
        revalidatePath('/admin/gallery');

    } catch (error: any) {
        console.error("Upload error:", error);
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
        throw new Error(
            error?.response?.data?.message || "Gagal mengambil data gallery"
        )
    }
}

export const deleteGalleryBatch = async (ids: string[]) => {
    const token = (await cookies()).get("token")?.value

    if (!token) {
        return { error: "Unauthorized" }
    }

    try {
        await Promise.all(
            ids.map((id) =>
                api.delete(`/v1/admin/gallery/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            )
        )
        revalidatePath('/admin/gallery')

        return { success: true }
    } catch (error: any) {
        console.error("Delete error:", error)
        return {
            error: error?.response?.data?.message || "Gagal menghapus foto"
        }
    }
}
