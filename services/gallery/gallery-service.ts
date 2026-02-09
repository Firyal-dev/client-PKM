'use server'

import api from "@/services/api"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Gallery } from "@/types/gallery-prop"
import { handleServiceError, tryAction } from "../utils"

const getToken = async () => (await cookies()).get("token")?.value

/**
 * Upload photo to gallery
 */
export const uploadPhoto = async (prevState: any, data: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    const result = await tryAction(async () => {
        await api.post('/v1/admin/gallery', data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        revalidatePath('/admin/gallery')
    }, "Gagal mengunggah foto")

    if (result.success) {
        redirect('/admin/gallery')
    }

    return result
}

/**
 * Get gallery photos with filter and pagination
 */
export const getGallery = async (page: number, limit: number, albumId?: string, noAlbum?: boolean): Promise<{ data: Gallery[], totalPages: number, currentPage: number }> => {
    try {
        let url = `/v1/gallery?page=${page}&limit=${limit}`
        if (albumId) url += `&album_id=${albumId}`
        if (noAlbum) url += `&no_album=true`

        const response = await api.get(url)
        return {
            data: response.data.docs,
            totalPages: response.data.totalPages,
            currentPage: response.data.page
        }
    } catch (error) {
        throw new Error(handleServiceError(error, "Gagal mengambil data gallery"))
    }
}

/**
 * Delete multiple gallery photos
 */
export const deleteGalleryBatch = async (ids: string[]) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    return tryAction(async () => {
        await Promise.all(
            ids.map((id) =>
                api.delete(`/v1/admin/gallery/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            )
        )
        revalidatePath('/admin/gallery')
        return { success: true }
    }, "Gagal menghapus beberapa foto")
}
