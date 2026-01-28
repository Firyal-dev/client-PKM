'use server'

import api from "@/services/api"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Gallery } from "@/types/gallery-prop"

const getToken = async () => (await cookies()).get("token")?.value

export const uploadPhoto = async (prevState: any, data: FormData) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await api.post('/v1/admin/gallery/upload-photo', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        revalidatePath('/admin/gallery')
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal mengunggah foto")
    }
    redirect('/admin/gallery')
}

export const getGallery = async (page: number, limit: number): Promise<{ data: Gallery[], totalPages: number, currentPage: number }> => {
    try {
        const response = await api.get(`/v1/admin/gallery?page=${page}&limit=${limit}`)
        return {
            data: response.data.docs,
            totalPages: response.data.totalPages,
            currentPage: response.data.page
        }
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal mengambil data gallery")
    }
}

export const deleteGalleryBatch = async (ids: string[]) => {
    const token = await getToken()
    if (!token) redirect("/admin/login")

    try {
        await Promise.all(
            ids.map((id) =>
                api.delete(`/v1/admin/gallery/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            )
        )
        revalidatePath('/admin/gallery')
        return { success: true }
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Gagal menghapus beberapa foto")
    }
}